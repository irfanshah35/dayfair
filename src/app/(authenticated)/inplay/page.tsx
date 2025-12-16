import dynamic from "next/dynamic";

const MInplay = dynamic(() => import("@/components/m-view/m-inplay"), {
  loading: () => <Loading />,
});

const Loading = dynamic(() => import("../../loading"));

const InplayPage = () => {
  return (
    <div>
      <MInplay />
    </div>
  );
};

export default InplayPage;