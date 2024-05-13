import React from "react";

/**
 * 'Beginner' proficiency level icon.
 */
function Intermediate(
  props: React.SVGProps<SVGSVGElement>,
  svgRef?: React.Ref<SVGSVGElement>,
) {
  return (
    <svg
      width="1.5em"
      height="1.5em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color="currentColor"
      ref={svgRef}
      {...props}
    >
      <path
        d="M4.63419 10.4941L5.67358 8.40095C5.70384 8.34038 5.75037 8.28943 5.80796 8.25382C5.86555 8.2182 5.93193 8.19934 5.99964 8.19934C6.06735 8.19934 6.13373 8.2182 6.19132 8.25382C6.24891 8.28943 6.29544 8.34038 6.3257 8.40095L7.36508 10.4941L9.6887 10.8318C9.75572 10.8411 9.81878 10.869 9.87068 10.9124C9.92258 10.9559 9.96123 11.013 9.98221 11.0773C10.0032 11.1417 10.0057 11.2106 9.98935 11.2762C9.97304 11.3419 9.93859 11.4017 9.88994 11.4487L8.20883 13.077L8.60571 15.3774C8.65652 15.6727 8.34446 15.8975 8.07761 15.7583L5.99964 14.6717L3.92127 15.7583C3.65482 15.8979 3.34276 15.6727 3.39357 15.377L3.79044 13.0766L2.10934 11.4483C2.06093 11.4012 2.02669 11.3415 2.01051 11.276C1.99433 11.2104 1.99687 11.1417 2.01783 11.0775C2.0388 11.0133 2.07734 10.9563 2.12909 10.9129C2.18084 10.8696 2.24372 10.8416 2.31058 10.8322L4.63419 10.4941V10.4941Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.6342 10.4941L17.6736 8.40095C17.7038 8.34038 17.7504 8.28943 17.808 8.25382C17.8656 8.2182 17.9319 8.19934 17.9996 8.19934C18.0674 8.19934 18.1337 8.2182 18.1913 8.25382C18.2489 8.28943 18.2954 8.34038 18.3257 8.40095L19.3651 10.4941L21.6887 10.8318C21.7557 10.8411 21.8188 10.869 21.8707 10.9124C21.9226 10.9559 21.9612 11.013 21.9822 11.0773C22.0032 11.1417 22.0057 11.2106 21.9894 11.2762C21.973 11.3419 21.9386 11.4017 21.8899 11.4487L20.2088 13.077L20.6057 15.3774C20.6565 15.6727 20.3445 15.8975 20.0776 15.7583L17.9996 14.6717L15.9213 15.7583C15.6548 15.8979 15.3428 15.6727 15.3936 15.377L15.7904 13.0766L14.1093 11.4483C14.0609 11.4012 14.0267 11.3415 14.0105 11.276C13.9943 11.2104 13.9969 11.1417 14.0178 11.0775C14.0388 11.0133 14.0773 10.9563 14.1291 10.9129C14.1808 10.8696 14.2437 10.8416 14.3106 10.8322L16.6342 10.4941V10.4941Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default React.forwardRef(Intermediate);

// Inspired by iconoir react-package (example: https://github.com/lucaburgio/iconoir/blob/master/packages/iconoir-react/src/3DArc.tsx)
