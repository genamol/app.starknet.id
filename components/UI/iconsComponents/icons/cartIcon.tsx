import React, { FunctionComponent } from "react";

const CartIcon: FunctionComponent<IconProps> = ({ width, color }) => {
  return (
    <svg
      width={width}
      height={width}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5 0C5.87258 0 0.5 5.37258 0.5 12C0.5 18.6274 5.87258 24 12.5 24C19.1274 24 24.5 18.6274 24.5 12C24.5 5.37258 19.1274 0 12.5 0ZM6.45166 5.06982L8.5874 5.74072C8.87014 5.83358 9.05846 6.09614 9.0913 6.36474L9.21142 7.54098L18.8823 8.62056C19.2976 8.701 19.5894 9.07594 19.5312 9.46138L18.9307 12.8451C18.8542 13.1991 18.5611 13.4417 18.2349 13.4457H9.64356L9.4751 14.4052H17.6343C18.0609 14.4202 18.3734 14.7451 18.3784 15.1244C18.3607 15.5572 18.0119 15.8405 17.6343 15.8451H8.61084C8.15572 15.8075 7.8216 15.4468 7.8916 15.0058L8.27538 12.8935L7.6748 6.98876L6.01952 6.46144C5.82752 6.39744 5.6834 6.27706 5.5874 6.10106C5.40576 5.72042 5.57542 5.29898 5.89942 5.11668C6.08434 5.02056 6.26494 5.00858 6.45166 5.06982ZM9.70362 16.2598C10.3249 16.2598 10.8286 16.7634 10.8286 17.3848C10.8286 18.0061 10.3249 18.5098 9.70362 18.5098C9.08234 18.5098 8.57862 18.0061 8.57862 17.3848C8.57862 16.7634 9.0823 16.2598 9.70362 16.2598ZM16.3071 16.2598C16.9284 16.2598 17.4321 16.7634 17.4321 17.3848C17.4321 18.0061 16.9284 18.5098 16.3071 18.5098C15.6858 18.5098 15.1821 18.0061 15.1821 17.3848C15.1821 16.7634 15.6858 16.2598 16.3071 16.2598Z"
        fill={color}
      />
    </svg>
  );
};

export default CartIcon;