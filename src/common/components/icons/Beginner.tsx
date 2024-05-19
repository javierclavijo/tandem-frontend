import React from "react";

/**
 * 'Beginner' proficiency level icon.
 */
const Beginner = (
  props: React.SVGProps<SVGSVGElement>,
  svgRef?: React.Ref<SVGSVGElement>,
) => {
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
        d="M10.6342 11.256L11.6736 9.16286C11.7038 9.10228 11.7504 9.05133 11.808 9.01572C11.8656 8.98011 11.9319 8.96124 11.9996 8.96124C12.0674 8.96124 12.1337 8.98011 12.1913 9.01572C12.2489 9.05133 12.2954 9.10228 12.3257 9.16286L13.3651 11.256L15.6887 11.5937C15.7557 11.603 15.8188 11.6309 15.8707 11.6743C15.9226 11.7178 15.9612 11.7749 15.9822 11.8392C16.0032 11.9036 16.0057 11.9725 15.9894 12.0382C15.973 12.1038 15.9386 12.1636 15.8899 12.2106L14.2088 13.8389L14.6057 16.1393C14.6565 16.4346 14.3445 16.6594 14.0776 16.5202L11.9996 15.4336L9.92127 16.5202C9.65482 16.6598 9.34276 16.4346 9.39357 16.1389L9.79044 13.8385L8.10934 12.2102C8.06093 12.1631 8.02669 12.1034 8.01051 12.0379C7.99433 11.9723 7.99687 11.9036 8.01783 11.8394C8.0388 11.7752 8.07734 11.7182 8.12909 11.6748C8.18084 11.6315 8.24372 11.6035 8.31058 11.5941L10.6342 11.256V11.256Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default React.forwardRef(Beginner);

// Inspired by iconoir react-package (example: https://github.com/lucaburgio/iconoir/blob/master/packages/iconoir-react/src/3DArc.tsx)
