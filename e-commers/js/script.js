const products = [
	{ id: "gate", name: "GATE 2025 Complete Guide", price: 599, image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSVnfPNJ3TsCl5g_6IBJX2uPsszSO3ec3s-XIz3MT_8UH12xy7IQrUb7xkTemOmoDRa0ZlalUlJ6cuDw6tJr1sjcKeijJrtEhTXrKUHkag&usqp=CAc", description: "Engineering concepts and practice sets" },
	{ id: "aptitude", name: "Quantitative Aptitude", price: 425, image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTkiF9DTGC4UzkvuBq1Dy36CpQTR1eBSLmQnK2eGOGTUH6zCIVefgGCg2KriOX9rNdJRcuVu4nChi7_qYjdvf7CffWIxHQy307UnmlZVwPf&usqp=CAc", description: "Fast methods for SSC and banking exams" },
	{ id: "gk", name: "General Knowledge Manual", price: 349, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcZw4o9X2UTKpbnwh7qokq1e18pGst6EVEVLQc_8CU-Q&s=10", description: "Current affairs and static GK revision" },
	{ id: "practice", name: "Government Exam Practice", price: 499, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQqSofJttfhX-w1IVHXBVKCNn8ULo_2LGu_Uw0dx0sUg&s", description: "Previous papers with detailed solutions" },
	{ id: "upsc", name: "UPSC Civil Services Guide", price: 699, image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSVnfPNJ3TsCl5g_6IBJX2uPsszSO3ec3s-XIz3MT_8UH12xy7IQrUb7xkTemOmoDRa0ZlalUlJ6cuDw6tJr1sjcKeijJrtEhTXrKUHkag&usqp=CAc", description: "Core subjects and answer writing practice" },
	{ id: "reasoning", name: "Verbal and Non-Verbal Reasoning", price: 399, image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTkiF9DTGC4UzkvuBq1Dy36CpQTR1eBSLmQnK2eGOGTUH6zCIVefgGCg2KriOX9rNdJRcuVu4nChi7_qYjdvf7CffWIxHQy307UnmlZVwPf&usqp=CAc", description: "Practice questions for competitive exams" },
	{ id: "english", name: "Objective General English", price: 375, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcZw4o9X2UTKpbnwh7qokq1e18pGst6EVEVLQc_8CU-Q&s=10", description: "Grammar, vocabulary and exam exercises" },
	{ id: "current", name: "Current Affairs Yearbook", price: 299, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQqSofJttfhX-w1IVHXBVKCNn8ULo_2LGu_Uw0dx0sUg&s", description: "Important events for government exams" }
];

const currentPage = location.pathname.split("/").pop() || "index.html";
const isRegistered = Boolean(localStorage.getItem("prepShelfUser"));
const isLoggedIn = Boolean(localStorage.getItem("prepShelfLoggedIn"));

if (!isRegistered && currentPage !== "register.html") location.replace("register.html");
if (isRegistered && !isLoggedIn && ["index.html", "about.html", "cart.html"].includes(currentPage)) location.replace("login.html");

function getCart() { return JSON.parse(localStorage.getItem("prepShelfCart") || "[]"); }
function saveCart(cart) { localStorage.setItem("prepShelfCart", JSON.stringify(cart)); }

function updateCartCount() {
	const count = getCart().reduce((total, item) => total + item.quantity, 0);
	document.querySelectorAll("[data-cart-count]").forEach((element) => { element.textContent = count; });
}

function addToCart(productId) {
	const product = products.find((item) => item.id === productId);
	const cart = getCart();
	const existing = cart.find((item) => item.id === productId);
	if (existing) existing.quantity += 1;
	else cart.push({ ...product, quantity: 1 });
	saveCart(cart);
	updateCartCount();
	const button = document.querySelector(`[data-add="${productId}"]`);
	if (button) { button.textContent = "Added"; setTimeout(() => { button.textContent = "Add to cart"; }, 1200); }
}

function renderCart() {
	const cartItems = document.querySelector("[data-cart-items]");
	if (!cartItems) return;
	const cart = getCart();
	const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
	cartItems.innerHTML = cart.length ? cart.map((item) => `
		<article class="cart-item"><img src="${item.image}" alt="${item.name}">
			<div><h3>${item.name}</h3><p>Qty: ${item.quantity} · ${item.description}</p></div>
			<strong class="cart-price">₹${(item.price * item.quantity).toLocaleString("en-IN")}</strong>
			<button class="remove-item" type="button" data-remove="${item.id}">Remove</button>
		</article>`).join("") : '<div class="empty-cart"><h3>Your cart is waiting for a good book.</h3><a class="button" href="index.html#books">Browse the shelf</a></div>';
	document.querySelector("[data-subtotal]").textContent = `₹${subtotal.toLocaleString("en-IN")}`;
	document.querySelector("[data-total]").textContent = `₹${subtotal.toLocaleString("en-IN")}`;
	document.querySelector("[data-checkout]").disabled = !cart.length;
	cartItems.querySelectorAll("[data-remove]").forEach((button) => button.addEventListener("click", () => {
		saveCart(getCart().filter((item) => item.id !== button.dataset.remove)); renderCart(); updateCartCount();
	}));
}

function applyCoupon() {
	const input = document.querySelector("[data-coupon-input]");
	const message = document.querySelector("[data-coupon-message]");
	const subtotal = getCart().reduce((total, item) => total + item.price * item.quantity, 0);
	if (input.value.trim().toUpperCase() !== "PREP10") { message.textContent = "Try code PREP10 for 10% off."; message.className = "coupon-message error"; return; }
	const discount = Math.round(subtotal * 0.1);
	localStorage.setItem("prepShelfCoupon", String(discount));
	document.querySelector("[data-discount]").textContent = `-₹${discount.toLocaleString("en-IN")}`;
	document.querySelector("[data-total]").textContent = `₹${(subtotal - discount).toLocaleString("en-IN")}`;
	message.textContent = "Coupon applied: 10% off your order."; message.className = "coupon-message success";
}

document.addEventListener("DOMContentLoaded", () => {
	updateCartCount();
	document.querySelectorAll("[data-add]").forEach((button) => button.addEventListener("click", () => addToCart(button.dataset.add)));
	const couponButton = document.querySelector("[data-apply-coupon]");
	if (couponButton) couponButton.addEventListener("click", applyCoupon);
	renderCart();
	const registerForm = document.querySelector("[data-register-form]");
	if (registerForm) registerForm.addEventListener("submit", (event) => { event.preventDefault(); localStorage.setItem("prepShelfUser", JSON.stringify({ name: registerForm.name.value, email: registerForm.email.value })); location.href = "login.html"; });
	const loginForm = document.querySelector("[data-login-form]");
	if (loginForm) loginForm.addEventListener("submit", (event) => { event.preventDefault(); localStorage.setItem("prepShelfLoggedIn", "true"); location.href = "index.html"; });
	const checkout = document.querySelector("[data-checkout]");
	if (checkout) checkout.addEventListener("click", () => { if (!getCart().length) return; alert("Your order has been placed successfully. Thank you for shopping with PrepShelf!"); localStorage.removeItem("prepShelfCart"); localStorage.removeItem("prepShelfCoupon"); location.href = "index.html"; });
});
