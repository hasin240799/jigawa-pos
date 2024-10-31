import banner from './bannercard.jpg';

const Banner = () => {
    return (
        <div className="banner w-full border  border-solid border-green-500 border-2">
            <img className='w-full' src={banner} alt="banner" />
        </div>
    );
};

export default Banner;
