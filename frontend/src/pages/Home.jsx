import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import NewArrivals from "../components/NewArrivals";
import FeaturedProducts from "../components/FeaturedProducts";
import BestSellers from "../components/BestSellers";
import PromoSection from "../components/PromoSection";
import CustomerReviews from "../components/CustomerReviews";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <CategorySection />
      <NewArrivals />
      <FeaturedProducts />
      <BestSellers />
      <PromoSection />
      <CustomerReviews />
      <Newsletter />
      <Footer />
    </>
  );
}

export default Home;
