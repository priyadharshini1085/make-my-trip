const hotelList = document.getElementById("hotel-grid");
const dealList = document.getElementById("deal-grid");
const dataFile = "final.json";
let hotels = [];
let firstHotel = 0;

const previewData = {
  hotels: [
    { name: "Hotel Tajmahal Palace", city: "Mumbai, India", price: 2000, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" },
    { name: "Mont Blanc", city: "Allappy , Kerala", price: 3200, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK-8Cz8ouWfYgD0nexBGk-HrqlXbj4rzUGqCpCWG-QOYP_5EOFjTeqA7Y&s=10" },
    { name: "Hotel Marriott", city: "Melbourne, Australia", price: 1200, image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80" },
    { name: "The Ocean Escape", city: "Malé, Maldives", price: 1500, image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80" }
  ],
  deals: [
    { badge: "30%", kicker: "From $350", title: "PARIS EUROSTAR BREAKS", description: "CURABITUR FRINGILLA MAURIS INTERDUM NEC MAGNA", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1100&q=80" },
    { badge: "50%", kicker: "7 nights, all inclusive", title: "CRUISE THE AEGEAN", description: "TOUR FRINGILLA MAURIS INTERDUM NEC MAGNA", image: "https://images.unsplash.com/photo-1544550285-f813152fb2fd?auto=format&fit=crop&w=1100&q=80" }
  ]
};

function formatPrice(price) {
  return "$" + Number(price).toLocaleString("en-US");
}

function createHotelCard(hotel) {
  return `
    <article class="hotel-card">
      <img src="${hotel.image}" alt="${hotel.name}" />
      <div class="card-meta">
        <div>
          <h3>${hotel.name}</h3>
          <p>${hotel.city}</p>
        </div>
        <span class="price">${formatPrice(hotel.price)}</span>
      </div>
    </article>`;
}

function createDealCard(deal) {
  return `
    <article class="deal-card">
      <img src="${deal.image}" alt="${deal.title}" />
      <span class="ribbon">${deal.badge}</span>
      <div class="deal-content">
        <small>${deal.kicker}</small>
        <h3>${deal.title}</h3>
        <p>${deal.description}</p>
      </div>
    </article>`;
}

function showHotels() {
  if (!hotelList || hotels.length === 0) return;

  let cards = "";

  for (let i = 0; i < 3; i += 1) {
    const hotelIndex = (firstHotel + i) % hotels.length;
    cards += createHotelCard(hotels[hotelIndex]);
  }

  hotelList.innerHTML = cards;
}

function showTravelData(travelData) {
  hotels = Array.isArray(travelData.hotels) ? travelData.hotels : [];
  showHotels();

  if (dealList) {
    const deals = Array.isArray(travelData.deals) ? travelData.deals : [];
    dealList.innerHTML = deals.map(createDealCard).join("");
  }
}

async function loadTravelData() {
  try {
    const response = await fetch(dataFile);

    if (!response.ok) {
      throw new Error("The travel data could not be loaded.");
    }

    const travelData = await response.json();
    showTravelData(travelData);
  } catch (error) {
    console.info(`Using preview data because ${dataFile} could not be loaded.`, error);
    showTravelData(previewData);
  }
}

document.querySelectorAll("[data-carousel]").forEach((button) => {
  button.addEventListener("click", () => {
    if (hotels.length === 0) return;

    if (button.dataset.carousel === "next") {
      firstHotel = (firstHotel + 1) % hotels.length;
    } else {
      firstHotel = (firstHotel - 1 + hotels.length) % hotels.length;
    }

    showHotels();
  });
});

const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const menuIsOpen = navLinks.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(menuIsOpen));
  });
}

const bookingForm = document.getElementById("booking-form");
const formMessage = document.getElementById("form-message");

if (bookingForm && formMessage) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const booking = new FormData(event.currentTarget);
    const place = booking.get("location") || "your chosen destination";
    const property = String(booking.get("property") || "Hotels").toLowerCase();

    formMessage.textContent = `Searching for ${property} in ${place}...`;
  });
}

const subscribeForm = document.getElementById("subscribe-form");
const subscribeMessage = document.getElementById("subscribe-message");

if (subscribeForm && subscribeMessage) {
  subscribeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = new FormData(event.currentTarget).get("email");
    subscribeMessage.textContent = `Thanks! Deals will be sent to ${email}.`;
    event.currentTarget.reset();
  });
}

loadTravelData();