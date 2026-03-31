const USER_API_BASE = "https://api.unimatcher-skynetconsult.com/api/user"; 
const PAYSTACK_PUBLIC_KEY = 'pk_test_abd87cfba7130da50ae00f96adb63ccdd6b0bc15'; 

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const paymentType = params.get('type') || 'check'; 
    
    // THE FIX: Explicitly capture the leadId from the URL
    // This is the "ID" of the specific discovery search they just did
    const leadId = params.get('leadId'); 
    
    const user = JSON.parse(localStorage.getItem('user_info'));
    const checkId = localStorage.getItem('pending_check_id');

    const payBtn = document.getElementById('pay-button');
    const loader = document.getElementById('loader');
    const amountDisplay = document.querySelector('.amount-display');
    const titleDisplay = document.getElementById('checkout-title');

    // Safety Check: If it's a discovery but no ID is present, stop here.
    if (paymentType === 'discovery' && !leadId) {
        alert("Error: Discovery record ID is missing. Please restart the pathfinder.");
        window.location.href = "pathfinder.html";
        return;
    }

    // Setup UI
    if (paymentType === 'discovery') {
        titleDisplay.innerText = "Pathfinder AI Checkout";
        document.getElementById('display-prog').innerText = "University Discovery Report";
    }

    payBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const paystack = new PaystackPop();
        
        paystack.newTransaction({
            key: PAYSTACK_PUBLIC_KEY,
            email: user.email,
            amount: 1000, // GHS 10.00
            currency: 'GHS',
            ref: `UM-${paymentType.toUpperCase()}-${Date.now()}`,
            onSuccess: (transaction) => {
                loader.classList.remove('hidden');
                payBtn.disabled = true;
                payBtn.innerText = "VERIFYING...";

                if (paymentType === 'discovery') {
                    handleDiscoverySuccess(transaction.reference, leadId); // Pass leadId here
                } else {
                    handleStandardSuccess(transaction.reference);
                }
            }
        });
    });

    // --- FIXED: Handle Discovery Payment ---
    async function handleDiscoverySuccess(ref, specificId) {
        try {
            const res = await fetch(`${USER_API_BASE}/unlock-discovery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userId: user.id || user.userId, 
                    leadId: specificId, 
                    paymentRef: ref 
                })
            });

            if (res.ok) {
                window.location.href = `discovery-results.html?id=${specificId}`;
            } else {
                showError(ref);
            }
        } catch (e) {
            console.error(e);
        }
    }

    // --- NEW: Handle Eligibility Check Payment (Fixes the "Stuck" issue) ---
    // Inside payment.js
async function handleStandardSuccess(ref) {
    try {
        const res = await fetch(`${USER_API_BASE}/unlock-check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                checkId: checkId, // This is the ID from localStorage
                paymentRef: ref 
            })
        });

        if (res.ok) {
            // THE FIX: Use 'checkId=' to match results.js exactly
            window.location.href = `results.html?checkId=${checkId}`; 
        } else {
            showError(ref);
        }
    } catch (e) {
        console.error(e);
    }
}

    function showError(ref) {
        loader.classList.add('hidden');
        payBtn.disabled = false;
        payBtn.innerText = "PAY NOW";
        alert("Verification failed. Contact support with Ref: " + ref);
    }
});