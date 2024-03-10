
const Loader = () => {
  return <h1>Loading ...</h1>;
};

export default Loader;

///////////////////////////////////////////////////////////////////////////

interface SkeletonProps {
  width?: string;
  length?: number;
}

export const Skeleton = ({ width = "unset", length = 3 }: SkeletonProps) => {

  const skeletions =  Array.from({length }, ( _ , idx)=>(
    <div className="skeleton-shape" key={idx}></div>
  ))

  return (
    <div className="skeleton-loader" style={{ width }}>
     {skeletions}
    </div>
  );
};
