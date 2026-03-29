import { Link } from 'react-router-dom';
import heroImg from '../assets/images/hero.png';
import { MdOutlineArrowRightAlt } from 'react-icons/md';
const Home = () => {
  return (
    <section 
      style={{ backgroundImage: ` url(${heroImg})` }}
      className="bg-center bg-cover h-[80vh] w-full relative"
    >
      <div className="max-w-150 absolute top-1/2 -translate-y-1/2 left-6">
        <h1 className="text-6xl text-white font-bold mb-4">
          Curating the World's Most Exquisite Portfolios
        </h1>
        <p className="text-xl mb-8 text-gray-500">
          The all-in-one platform for your modern business needs.
        </p>
        <Link 
          to="/login"
          className="px-6 py-4 bg-slate-950 text-gray-100 rounded-md font-Manrope-SemiBold hover:bg-slate-700 transition flex items-center gap-3 w-fit"
        >
          Explore now <MdOutlineArrowRightAlt className='text-2xl'/>

        </Link>
      </div>
    </section>
  );
};

export default Home;
