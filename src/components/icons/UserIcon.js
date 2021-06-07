import React from "react";
import PropTypes from "prop-types";

const UserIcon = ({ className }) => {
    return (
        <svg
            className={className}
            width="20"
            height="22"
            viewBox="0 0 20 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M13.7105 11.7101C14.6909 10.9388 15.4065 9.88105 15.7577 8.68407C16.109 7.48709 16.0784 6.21039 15.6703 5.03159C15.2621 3.85279 14.4967 2.83052 13.4806 2.10698C12.4644 1.38344 11.2479 0.994629 10.0005 0.994629C8.75303 0.994629 7.5366 1.38344 6.52041 2.10698C5.50423 2.83052 4.73883 3.85279 4.3307 5.03159C3.92257 6.21039 3.892 7.48709 4.24325 8.68407C4.59449 9.88105 5.31009 10.9388 6.29048 11.7101C4.61056 12.3832 3.14477 13.4995 2.04938 14.94C0.953983 16.3806 0.270048 18.0914 0.070485 19.8901C0.0560396 20.0214 0.0676015 20.1543 0.10451 20.2812C0.141419 20.408 0.202952 20.5264 0.285596 20.6294C0.452504 20.8376 0.695269 20.971 0.960485 21.0001C1.2257 21.0293 1.49164 20.9519 1.69981 20.785C1.90798 20.6181 2.04131 20.3753 2.07049 20.1101C2.29007 18.1553 3.22217 16.3499 4.6887 15.0389C6.15524 13.7279 8.05338 13.0032 10.0205 13.0032C11.9876 13.0032 13.8857 13.7279 15.3523 15.0389C16.8188 16.3499 17.7509 18.1553 17.9705 20.1101C17.9977 20.3558 18.1149 20.5828 18.2996 20.7471C18.4843 20.9115 18.7233 21.0016 18.9705 21.0001H19.0805C19.3426 20.97 19.5822 20.8374 19.747 20.6314C19.9119 20.4253 19.9886 20.1625 19.9605 19.9001C19.76 18.0963 19.0724 16.3811 17.9713 14.9383C16.8703 13.4955 15.3974 12.3796 13.7105 11.7101ZM10.0005 11.0001C9.20936 11.0001 8.436 10.7655 7.7782 10.326C7.12041 9.88648 6.60772 9.26176 6.30497 8.53086C6.00222 7.79995 5.923 6.99569 6.07734 6.21976C6.23168 5.44384 6.61265 4.73111 7.17206 4.1717C7.73147 3.61229 8.4442 3.23132 9.22012 3.07698C9.99605 2.92264 10.8003 3.00186 11.5312 3.30461C12.2621 3.60736 12.8868 4.12005 13.3264 4.77784C13.7659 5.43564 14.0005 6.209 14.0005 7.00012C14.0005 8.06099 13.5791 9.07841 12.8289 9.82855C12.0788 10.5787 11.0614 11.0001 10.0005 11.0001Z"
                fill="currentColor"
            />
        </svg>
    );
};

UserIcon.propTypes = {
    className: PropTypes.string,
};

UserIcon.defaultProps = {
    className: "",
};

export default UserIcon;