"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "@studio-freight/lenis";

declare global {
    interface Window {
        lenis: Lenis;
    }
}
type Props = {
    children: ReactNode;
};

//export lenis best set

export default function LenisProvider({ children }: Props) {
    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.08,
            wheelMultiplier: 1,
            touchMultiplier: 1,
        });

        window.lenis = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}

// "use client";

// import { useEffect } from "react";
// import Lenis from "lenis";

// export default function LenisProvider({
//     children,
// }: {
//     children: React.ReactNode;
// }) {
//     useEffect(() => {
//         const lenis = new Lenis({
//             smoothWheel: true,
//         });

//         function raf(time: number) {
//             lenis.raf(time);
//             requestAnimationFrame(raf);
//         }

//         requestAnimationFrame(raf);

//         return () => {
//             lenis.destroy();
//         };
//     }, []);

//     return children;
// }