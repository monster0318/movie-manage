"use client"
import { useEffect } from "react";
import { useStore } from "@/store/useStore";

const useWindowResize = () => {
  const { setIsMobile } = useStore();

  useEffect(() => {
    const handleResize = () => {
      // Check window width and update the isMobile state
      setIsMobile(window.innerWidth < 768);
    };

    // Initialize the resize check
    handleResize();

    // Add event listener to track window resizing
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setIsMobile]);  // Only re-run if setIsMobile changes
};

export default useWindowResize;
