"use client"
import Image from "next/image"

export default function Footer() {
    return (
        <div className="relative bottom-0 w-full h-[111px]">
            <Image className="footer-logo absolute bottom-0"
                src="/Vector1.svg"
                alt="Next.js Logo"
                fill
                style={{ objectFit: "cover" }} // Keeps aspect ratio
                priority
            />
            <Image className="footer-logo absolute bottom-0"
                src="/Vector2.svg"
                alt="Next.js Logo"
                fill
                style={{ objectFit: "cover" }} // Keeps aspect ratio
                priority
            />
        </div>
    )
}