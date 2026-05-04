"use client";

import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";

interface CarouselProps {
  items: React.ReactNode[];
  initialScroll?: number;
}

type CardType = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

/* =======================
   CAROUSEL
======================= */

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScroll();
    }
  }, [initialScroll]);

  const checkScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
  };

  const scroll = (direction: "left" | "right") => {
    carouselRef.current?.scrollBy({
      left: direction === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  const handleCardClose = (index: number) => {
    carouselRef.current?.scrollTo({
      left: index * 420,
      behavior: "smooth",
    });
    setCurrentIndex(index);
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div
          ref={carouselRef}
          onScroll={checkScroll}
          className="flex w-full overflow-x-scroll scroll-smooth py-16 [scrollbar-width:none]"
        >
          <div className="flex gap-8 pl-8 mx-auto max-w-7xl">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-end gap-3 pr-10 mt-4">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg disabled:opacity-40"
          >
            <IconArrowNarrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg disabled:opacity-40"
          >
            <IconArrowNarrowRight className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

/* =======================
   CARD
======================= */

export const Card = ({
  card,
  index,
}: {
  card: CardType;
  index: number;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  useOutsideClick(containerRef as React.RefObject<HTMLDivElement>, () => handleClose());

  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  return (
    <>
      {/* MODAL */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={containerRef}
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ duration: 0.4 }}
              className="relative max-w-4xl rounded-3xl bg-white p-10 shadow-2xl dark:bg-neutral-900"
            >
              <button
                onClick={handleClose}
                className="absolute right-6 top-6"
              >
                <IconX className="h-6 w-6 text-black dark:text-white" />
              </button>

              <p className="text-lg font-medium text-gray-500">
                {card.category}
              </p>
              <h2 className="mt-3 text-4xl font-bold">{card.title}</h2>

              <div className="mt-8">{card.content}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CARD */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="group relative h-80 w-60 md:h-[42rem] md:w-96 overflow-hidden rounded-3xl shadow-2xl"
      >
        {/* Floating effect */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute inset-0"
        />

        {/* Overlay */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Text */}
        <div className="absolute bottom-8 left-6 z-30 text-left">
          <p className="text-sm text-white/80">{card.category}</p>
          <h3 className="mt-2 text-2xl md:text-3xl font-bold text-white">
            {card.title}
          </h3>
        </div>

        {/* Image */}
        <img
          src={card.src}
          alt={card.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      </motion.button>
    </>
  );
};