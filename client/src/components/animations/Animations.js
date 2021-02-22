const Animations = {
  slidefromRight: {
    visible: {
      x: 0,
      transition: {
        duration: 1.2,
        type: "spring",
        stiffness: 50,
      },
    },
    hidden: { x: "-100vw" },
    exit: {
      duration: 1,
      stiffness: 50,
      x: "100vw",
      transition: { ease: "easeInOut" },
    },
  },

  logoreveal: {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        duration: 1,
      },
    },
    exit: {
      duration: 1,
      scale: 0,
    },
  },

  slideDown: {
    hidden: { y: "-10vh" },
    visible: {
      y: 0,
      transition: {
        duration: 1,
      },
    },
    exit: {
      y: "-80vh",
      duration: 1,
    },
  },
  showModal: {
    hidden: { y: "-80vh" },
    visible: {
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        duration: 1,
      },
    },
    // exit: {
    //   y: "-80vh",
    // },
    exit: {
      y: "-80vw",
      duration: 1,
    },
  },
  Fadein: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        type:"easeInOut",
        duration: 1,
      },
    },
    exit: {
      opacity: 0,
    },
  },
};

export default Animations;
