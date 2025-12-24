"use client";
import dynamic from "next/dynamic";
import { useAppStore } from "@/lib/store/store";
import React, { useEffect, useState } from "react";
import { CONFIG } from "@/lib/config";
import { useToast } from "@/components/common/toast/toast-context";
import { useRouter } from "next/navigation";
import { fetchData } from "@/lib/functions";

const Loading = dynamic(() => import("../../loading"));

interface StakeItem {
  stakeName: string;
  stakeAmount: number | string;
}

interface StakeData {
  userId: string;
  stake: StakeItem[];
}

export default function Settings() {
  const { showToast } = useToast();
  const { stakeValue, setStakeValue } = useAppStore();
  const [stakeitems, setStakeItems] = useState<StakeData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const eventsType = stakeValue?.stake;
    if (!eventsType) return;
    setStakeItems(stakeValue);
  }, [stakeValue]);

  const handleChange = (index: any, newValue: any) => {
    if (!stakeitems) return;
    const updatedStakes = [...stakeitems.stake];
    updatedStakes[index] = {
      ...updatedStakes[index],
      stakeAmount: newValue,
    };

    setStakeItems({
      ...stakeitems,
      stake: updatedStakes,
    });
  };

  const handleUpdateClick = async () => {
    if (!stakeitems) return;

    try {
      const payloadObject: any = {};

      stakeitems.stake.forEach((item) => {
        payloadObject[item.stakeAmount] = item.stakeAmount.toString();
      });
      const stakeString = JSON.stringify(payloadObject);

      fetchData({
        url: CONFIG.userUpdateStackValueURL,
        payload: JSON.stringify({ stake: stakeString }),
        showToast: showToast,
      });

      fetchData({
        url: CONFIG.getUserBetStake,
        payload: { key: CONFIG.siteKey },
        cachedKey: "betStake",
        setFn: setStakeValue,
        expireIn: CONFIG.getUserBetStakeTime,
        forceApiCall: true,
      });

      router.push("/");
    } catch (error) {
      console.error("Error updating stake:", error);
      showToast("error", "Network Error", "Unable to update stake");
    }
  };

  return (
    <div className="min-[992px]:mx-1.25 min-[992px]:my-1.5">
      <div className="bg-white shadow rounded">
        <div
          className="bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)]
                     text-white h-8.25 flex items-center px-[6px] min-[992px]:px-3.5 min-[992px]:rounded-t"
        >
          <h4 className="text-[18px] min-[992px]:text-[20px] font-bold font-roboto bottom-0.5">
            Update Stake
          </h4>
        </div>

        <div className="pl-1 pr-1.5 md:px-1 py-1.25">
          <div className="mb-2.25 min-[992px]:pl-1">
            <p className="text-[14px] min-[992px]:-ml-0.5">
              <b className="md:text-[16px] text-black font-black">Stake Amount</b>
            </p>
          </div>

          {/* 🔹 Lazy load stake inputs */}
          <div className="grid grid-cols-4 gap-x-2.5 gap-y-1.5 md:gap-x-2.5 md:gap-y-1.5 w-full md:w-1/2 pl-0.5 md:pl-1">
            {stakeitems ? (
              stakeitems.stake.map((item, i) => (
                <input
                  key={i}
                  type="text"
                  value={item.stakeAmount}
                  onChange={(e) => handleChange(i, e.target.value)}
                  placeholder="0"
                  maxLength={9}
                  className="border border-[#f4b501] shadow-[0_0_2px] md:shadow-none md:border-[#dee2e6] rounded-0.5 md:rounded text-[black] text-center h-8.5 md:h-9.5 text-[12px] min-[992px]:text-[16px] placeholder:text-[12px] max-[992px]:tracking-[0.5px]"
                />
              ))
            ) : (
              <div className="col-span-4 flex justify-center py-2">
                <Loading />
              </div>
            )}
          </div>

          <div className="mt-3 pl-0.5 md:pl-1">
            <button
              onClick={handleUpdateClick}
              className="w-full md:w-1/4 h-9.5 text-[16px] 
                         bg-[linear-gradient(-180deg,#f4b501_0%,#f68700_100%)]
                         text-black rounded-[1px]"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
