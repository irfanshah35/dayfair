'use client'
import React, { useEffect, useState } from 'react'
interface RulesModalProps {
    open: boolean;
    onClose: () => void;
}

export default function RulesModal({ open, onClose }: RulesModalProps) {


    const [show, setShow] = useState(false);

    // Handle slide-down animation
    useEffect(() => {
        if (open) {
            setShow(true);
        } else {
            // Delay unmount for animation
            const timer = setTimeout(() => setShow(false), 300);
            return () => clearTimeout(timer);
        }
    }, [open]);

    if (!show) return null;

    // if (!open) return null;
    return (
        <div>
            <div className="fixed inset-0 pt-[14px] bg-black/50 flex items-center justify-center z-50">
                <div className={`
          bg-white mx-[7px] w-full max-w-[500px] max-h-[100vh] shadow-lg overflow-y-auto no-scrollbar
          transform transition-all duration-300 ease-out
          ${open ? "translate-y-0 opacity-100" : "-translate-y-[100%] opacity-0"}
        `}>

                    {/* Header */}
                    <div className="flex items-center justify-between px-2.5 py-[7px] bg-[linear-gradient(180deg,#000000,#000000_42%,#000000)] text-white">
                        <h1 className="text-xl font-medium">Rules</h1>
                        <button
                            onClick={onClose}
                            className="
    bg-transparent 
    border-0 
    p-0 
    text-3xl 
    leading-none 
    hover:text-red-500
    md:text-3xl
    max-[992px]:text-[35px]
  "
                        >
                            ×
                        </button>

                    </div>
                    <div className="p-3 pt-9 pb-9 text-[15px]">
                        <span className=''>
                            <b>MARKET INFORMATION</b>
                        </span>
                        <br /><br />

                        <p>
                            For further information please see{" "}
                            <a
                                href="http://content.betfair.com/aboutus/content.asp?sWhichKey=Rules%20and%20Regulations#undefined.do"
                                target="_blank"
                                className="text-blue-600 underline"
                            >
                                Rules &amp; Regs
                            </a>
                            .
                        </p>

                        <br />

                        <p>
                            Which team will be awarded the most points in this match? At the
                            scheduled start of the match all unmatched bets will be cancelled and
                            the market turned <b>IN PLAY</b>. This market will not be actively
                            managed therefore it is the responsibility of all users to manage
                            their own positions. Competition and Dead Heat Rules apply.
                        </p>

                        <br />

                        <p>If a match is abandoned, all bets on this market will be void.</p>

                        <br />

                        <p>
                            For the avoidance of doubt, the Sheffield Shield Points System is as
                            follows:
                        </p>

                        <br />

                        <ul className="list-none space-y-0">
                            <li>Outright Win - 6 points</li>
                            <li>Tie - 3 points</li>
                            <li>Draw - 1 point</li>
                            <li>
                                Batting Bonus Points: 0.01 points for every run scored over 200 in
                                the first 100 overs of each side's first innings.
                            </li>
                            <li>
                                Bowling Bonus Points: 0.1 points for each wicket taken in the first
                                100 overs of each side's first innings.
                            </li>
                        </ul>

                        <br />

                        <p>
                            This is a{" "}
                            <a
                                href="http://cross-matching.betfair.com.au/"
                                target="_blank"
                                className="text-blue-600 underline"
                            >
                                cross-matching
                            </a>{" "}
                            market.
                        </p>

                        <br />

                        <p className="font-bold">Customers should be aware that:</p>

                        <ul className="list-disc ml-6 space-y-2 mt-2">
                            <li>
                                Transmissions described as “live” by some broadcasters may actually
                                be delayed and that all in-play matches are not necessarily
                                televised.
                            </li>
                            <li>
                                The extent of any such delay may vary, depending on the set-up
                                through which they are receiving pictures or data.
                            </li>
                        </ul>

                        <br />

                        <b>BET IN-PLAY</b>
                        <br /><br />

                        <p className='pb-9'>
                            Australian customers call Telbet to bet in-play on this market – call{" "}
                            <b>132BET (132238)</b>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
