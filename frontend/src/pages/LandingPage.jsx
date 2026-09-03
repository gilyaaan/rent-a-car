import { Link } from "react-router-dom";

function LandingPage() {
  const vehicles = [
    {
      name: "Mercedes S-Class",
      price: "₱15,000",
      image:
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80",
      transmission: "Automatic",
      seats: "4 Seats",
      type: "Luxury",
    },
    {
      name: "Range Rover Sport",
      price: "₱12,500",
      image:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80",
      transmission: "Automatic",
      seats: "5 Seats",
      type: "SUV",
    },
    {
      name: "Porsche 911",
      price: "₱20,000",
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
      transmission: "Manual",
      seats: "2 Seats",
      type: "Sports",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#111827]">

      {/* ===================================================== */}
      {/* TOP BAR */}
      {/* ===================================================== */}

      <div className="bg-black text-white h-7">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between text-[10px] sm:text-xs">

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            <span>We're Open 24/7</span>
          </div>

          <div className="hidden sm:flex items-center gap-5">
            <span>Find a Location</span>
            <span>Help Center</span>
          </div>

        </div>
      </div>


      {/* ===================================================== */}
      {/* NAVIGATION */}
      {/* ===================================================== */}

      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">

          <div className="h-16 flex items-center justify-between">

            {/* LOGO */}
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                A
              </div>

              <div className="leading-tight">
                <div className="font-bold text-base">
                  ARGO
                </div>

                <div className="text-[9px] text-gray-500">
                  Premium Car Rentals
                </div>
              </div>
            </Link>


            {/* DESKTOP NAVIGATION */}
            <div className="hidden lg:flex items-center gap-7 text-xs text-gray-700">

              <a
                href="#home"
                className="hover:text-black transition"
              >
                Home⌄
              </a>

              <a
                href="#about"
                className="hover:text-black transition"
              >
                About Us
              </a>

              <a
                href="#vehicles"
                className="hover:text-black transition"
              >
                Car Listing
              </a>

              <a
                href="#booking"
                className="hover:text-black transition"
              >
                Car Booking⌄
              </a>

              <a
                href="#vehicles"
                className="hover:text-black transition"
              >
                Pages⌄
              </a>

              <a
                href="#contact"
                className="hover:text-black transition"
              >
                Contact
              </a>

            </div>


            {/* AUTH BUTTONS */}
            <div className="flex items-center gap-3">

              <Link
                to="/login"
                className="text-xs font-medium text-gray-700 hover:text-black transition"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="bg-black text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-gray-800 transition"
              >
                Register
              </Link>

            </div>

          </div>

        </div>
      </nav>


      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section
        id="home"
        className="relative overflow-hidden bg-[#f5f5f5]"
      >

        {/* Background car */}
        <div className="absolute inset-0">

          <img
            src="https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury car"
            className="w-full h-full object-cover"
          />

          {/* Fade overlay */}
          <div className="absolute inset-0 bg-white/85"></div>

          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/50"></div>

        </div>


        {/* Hero content */}
        <div className="relative max-w-7xl mx-auto px-6">

          <div className="min-h-[470px] lg:min-h-[500px] flex items-center">

            <div className="grid lg:grid-cols-2 gap-12 w-full items-center">

              {/* LEFT CONTENT */}
              <div className="pt-12 pb-12 lg:pt-16">

                <h1 className="text-5xl md:text-6xl lg:text-[60px] font-bold leading-[1.05] tracking-tight text-[#111827]">
                  Experience
                  <br />
                  Luxury Driving
                </h1>

                <p className="mt-6 max-w-lg text-sm md:text-base text-gray-600 leading-relaxed">
                  Discover our premium fleet of luxury vehicles and
                  experience the perfect blend of comfort and performance.
                </p>


                <div className="flex flex-wrap gap-3 mt-7">

                  <a
                    href="#vehicles"
                    className="bg-black text-white px-7 py-3 rounded-full text-xs font-medium hover:bg-gray-800 transition"
                  >
                    View Our Fleet
                  </a>

                  <a
                    href="#about"
                    className="border border-black text-black px-7 py-3 rounded-full text-xs font-medium hover:bg-black hover:text-white transition"
                  >
                    Learn More
                  </a>

                </div>

              </div>


              {/* RIGHT BOOKING BOX */}
              <div
                id="booking"
                className="flex justify-center lg:justify-end py-10"
              >

                <div className="w-full max-w-[390px] bg-white rounded-2xl shadow-xl p-6 md:p-7">

                  <h2 className="text-xl font-bold">
                    Find Your Perfect Car
                  </h2>


                  {/* Vehicle Type */}
                  <div className="mt-5">

                    <label className="block text-[10px] text-gray-600 mb-1.5">
                      Select Vehicle Type
                    </label>

                    <select className="w-full h-10 rounded-full bg-gray-100 border-0 px-4 text-xs outline-none focus:ring-2 focus:ring-black">
                      <option>All Types</option>
                      <option>Sedan</option>
                      <option>SUV</option>
                      <option>Sports</option>
                      <option>Luxury</option>
                    </select>

                  </div>


                  {/* Location */}
                  <div className="mt-4">

                    <label className="block text-[10px] text-gray-600 mb-1.5">
                      Pick-Up Location
                    </label>

                    <select className="w-full h-10 rounded-full bg-gray-100 border-0 px-4 text-xs outline-none focus:ring-2 focus:ring-black">
                      <option>Select Location</option>
                      <option>Manila</option>
                      <option>Quezon City</option>
                      <option>Makati</option>
                      <option>Pasig</option>
                    </select>

                  </div>


                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3 mt-4">

                    <div>

                      <label className="block text-[10px] text-gray-600 mb-1.5">
                        Pick-Up Date
                      </label>

                      <input
                        type="date"
                        className="w-full h-10 rounded-full bg-gray-100 border-0 px-3 text-xs outline-none focus:ring-2 focus:ring-black"
                      />

                    </div>


                    <div>

                      <label className="block text-[10px] text-gray-600 mb-1.5">
                        Return Date
                      </label>

                      <input
                        type="date"
                        className="w-full h-10 rounded-full bg-gray-100 border-0 px-3 text-xs outline-none focus:ring-2 focus:ring-black"
                      />

                    </div>

                  </div>


                  {/* Search */}
                  <button
                    type="button"
                    className="w-full h-10 mt-5 rounded-full bg-black text-white text-xs font-medium hover:bg-gray-800 transition"
                  >
                    Search Available Cars
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* FEATURED VEHICLES */}
      {/* ===================================================== */}

      <section
        id="vehicles"
        className="py-14 md:py-16 bg-white"
      >

        <div className="max-w-6xl mx-auto px-6">

          {/* Heading */}
          <div className="text-center">

            <h2 className="text-2xl md:text-3xl font-bold">
              Featured Vehicles
            </h2>

            <p className="max-w-xl mx-auto mt-3 text-xs md:text-sm text-gray-500 leading-relaxed">
              Choose from our selection of premium vehicles, each offering
              a unique blend of luxury and performance.
            </p>

          </div>


          {/* Vehicle Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">

            {vehicles.map((vehicle) => (

              <div
                key={vehicle.name}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition"
              >

                {/* IMAGE */}
                <div className="relative h-44 overflow-hidden">

                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />

                  <span className="absolute top-3 right-3 bg-black text-white text-[10px] px-3 py-1 rounded-full">
                    Premium
                  </span>

                </div>


                {/* INFO */}
                <div className="p-4">

                  <div className="flex items-center justify-between gap-3">

                    <h3 className="font-bold text-sm md:text-base">
                      {vehicle.name}
                    </h3>

                    <div className="text-right whitespace-nowrap">

                      <span className="font-bold text-base">
                        {vehicle.price}
                      </span>

                      <span className="text-[10px] text-gray-500">
                        /day
                      </span>

                    </div>

                  </div>


                  {/* Specifications */}
                  <div className="flex items-center justify-between mt-4 text-[10px] text-gray-500">

                    <span>
                      ✓ {vehicle.transmission}
                    </span>

                    <span>
                      ✓ {vehicle.seats}
                    </span>

                    <span>
                      ✓ {vehicle.type}
                    </span>

                  </div>


                  {/* Book */}
                  <Link
                    to="/login"
                    className="block text-center w-full bg-black text-white rounded-full py-2.5 mt-4 text-xs font-medium hover:bg-gray-800 transition"
                  >
                    Book Now
                  </Link>

                </div>

              </div>

            ))}

          </div>


          {/* View All */}
          <div className="text-center mt-8">

            <a
              href="#vehicles"
              className="inline-block border border-black rounded-full px-7 py-2.5 text-xs font-medium hover:bg-black hover:text-white transition"
            >
              View All Cars
            </a>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* ABOUT */}
      {/* ===================================================== */}

      <section
        id="about"
        className="py-16 bg-[#f7f7f7]"
      >

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center max-w-2xl mx-auto">

            <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">
              About ARGO
            </p>

            <h2 className="text-2xl md:text-3xl font-bold mt-2">
              Your Journey Starts Here
            </h2>

            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              ARGO provides a convenient way to discover, reserve, and
              manage premium rental vehicles. Whether you need a vehicle
              for business, travel, or a special occasion, we're here to
              make your journey easier.
            </p>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* CONTACT / CTA */}
      {/* ===================================================== */}

      <section
        id="contact"
        className="py-14 bg-white"
      >

        <div className="max-w-6xl mx-auto px-6">

          <div className="bg-black rounded-3xl text-white px-8 py-12 text-center">

            <h2 className="text-2xl md:text-3xl font-bold">
              Ready to Hit the Road?
            </h2>

            <p className="text-sm text-gray-300 mt-3">
              Find the perfect vehicle for your next journey.
            </p>

            <Link
              to="/register"
              className="inline-block bg-white text-black rounded-full px-7 py-3 mt-6 text-xs font-semibold hover:bg-gray-200 transition"
            >
              Get Started
            </Link>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <footer className="bg-black text-white">

        <div className="max-w-6xl mx-auto px-6 py-8">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <div className="text-center md:text-left">

              <div className="font-bold">
                ARGO
              </div>

              <div className="text-[10px] text-gray-500 mt-1">
                Premium Car Rentals
              </div>

            </div>

            <p className="text-[10px] text-gray-500">
              © 2026 ARGO Rentals. All rights reserved.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default LandingPage;