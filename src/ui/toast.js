import gsap from "gsap";

const toast = document.getElementById("toast");

export const showToast = (message, type = "success") => {

    toast.textContent = message;
    toast.classList.remove("hidden");

    toast.className = "fixed top-5 right-5 px-6 py-3 rounded-xl text-white";

    if (type === "success") {
        toast.classList.add("bg-green-500");
    }

    if (type === "error") {
        toast.classList.add("bg-red-500");
    }

    if (type === "warning") {
        toast.classList.add("bg-yellow-500");
    }

   
    gsap.fromTo(
        toast,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
    );

    
    setTimeout(() => {

        gsap.to(toast, {
            x: 100,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                toast.classList.add("hidden");
            }
        });

    }, 2000);
};