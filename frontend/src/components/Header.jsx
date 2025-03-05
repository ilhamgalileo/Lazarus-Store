import SmallProduct from "../pages/Products/SmallProduct";
import { useGetNewProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./loader";

const Header = () => {
  const { data, isLoading, error } = useGetNewProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>Error</h1>;
  }

  return (
    <div className="flex flex-row sm:flex-row ml-[5rem] sm:ml-[8rem] mt-8">
      <div className="grid grid-cols-2 gap-2">
        {data.slice(0, 4).map((product) => (
          <SmallProduct key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Header;
