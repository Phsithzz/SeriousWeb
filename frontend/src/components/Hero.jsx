import hero1 from "../assets/hero1.svg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";
import hero4 from "../assets/hero4.jpg";
import Slider from "react-slick";

const imageList = [
  {
    id: 1,
    image: hero1,
    title:"ADIDAS"
  
  },
  {
    id: 2,
    image: hero2,
    title:"NIKE"

  },
  {
    id: 3,
    image: hero3,
    title:"NEWBALANCE"

  },
   {
    id: 4,
    image: hero4,
    title:"PUMA"
}
];

const Hero = () => {
  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <div className="w-full h-[200px] p-8">
  <Slider {...settings}>
    {imageList.map((item) => (
      <div key={item.id} className="relative w-full h-[200px]">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-contain rounded-lg"
        />
      </div>
    ))}
  </Slider>
</div>

  );
};

export default Hero;