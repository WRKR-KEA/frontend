'use client'
import React from 'react'

const PageTitle = ({ pathname }) => {

    const pageTitle = (() => {
        switch (true) {
            case pathname === "/user/home" || pathname === "/manager/home":
                return "홈";
            case pathname === "/user/createticket":
                return "티켓 요청";
            case pathname.startsWith("/user/myticket"):
                return "티켓 조회";
            case pathname === "/user/mypage" || pathname === "/manager/mypage":
                return "계정";
            case pathname.startsWith("/manager/myticket"):
                return "담당 티켓";
            case pathname.startsWith("/manager/departmentticket"):
                return "부서 티켓";
            case pathname === "/manager/managerlist":
                return "담당자 조회";
            case pathname.startsWith("/manager/monitoring"):
                return "통계";
            case pathname.startsWith("/administer/memberlist"):
                return "회원 조회";
            case pathname === "/administer/memberenrollment":
                return "회원 등록";
            case pathname === "/administer/categorymanagement":
                return "카테고리 관리";
            case pathname === "/administer/log":
                return "접속 로그 조회"
            default:
                return "페이지 없음";
        }
    })();


    const pageIcon = (() => {
        switch (true) {
            case pathname === "/user/home" || pathname === "/manager/home":
                return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-4">
                    <path
                        d="M19.7499 10C19.7499 9.80108 19.6709 9.61032 19.5302 9.46967C19.3896 9.32901 19.1988 9.25 18.9999 9.25C18.801 9.25 18.6102 9.32901 18.4696 9.46967C18.3289 9.61032 18.2499 9.80108 18.2499 10H19.7499ZM5.74991 10C5.74991 9.80108 5.67089 9.61032 5.53024 9.46967C5.38959 9.32901 5.19882 9.25 4.99991 9.25C4.801 9.25 4.61023 9.32901 4.46958 9.46967C4.32893 9.61032 4.24991 9.80108 4.24991 10H5.74991ZM20.4699 12.53C20.5386 12.6037 20.6214 12.6628 20.7134 12.7038C20.8054 12.7448 20.9047 12.7668 21.0054 12.7686C21.1061 12.7704 21.2061 12.7518 21.2995 12.7141C21.3929 12.6764 21.4777 12.6203 21.5489 12.549C21.6202 12.4778 21.6763 12.393 21.714 12.2996C21.7518 12.2062 21.7703 12.1062 21.7685 12.0055C21.7667 11.9048 21.7447 11.8055 21.7037 11.7135C21.6627 11.6215 21.6036 11.5387 21.5299 11.47L20.4699 12.53ZM11.9999 3L12.5299 2.47C12.3893 2.32955 12.1987 2.25066 11.9999 2.25066C11.8012 2.25066 11.6105 2.32955 11.4699 2.47L11.9999 3ZM2.46991 11.47C2.39622 11.5387 2.33712 11.6215 2.29613 11.7135C2.25514 11.8055 2.23309 11.9048 2.23132 12.0055C2.22954 12.1062 2.24807 12.2062 2.28579 12.2996C2.32351 12.393 2.37965 12.4778 2.45087 12.549C2.52209 12.6203 2.60692 12.6764 2.70031 12.7141C2.7937 12.7518 2.89373 12.7704 2.99443 12.7686C3.09513 12.7668 3.19445 12.7448 3.28645 12.7038C3.37845 12.6628 3.46125 12.6037 3.52991 12.53L2.46991 11.47ZM6.99991 21.75H16.9999V20.25H6.99991V21.75ZM19.7499 19V10H18.2499V19H19.7499ZM5.74991 19V10H4.24991V19H5.74991ZM21.5299 11.47L12.5299 2.47L11.4699 3.53L20.4699 12.53L21.5299 11.47ZM11.4699 2.47L2.46991 11.47L3.52991 12.53L12.5299 3.53L11.4699 2.47ZM16.9999 21.75C17.7293 21.75 18.4287 21.4603 18.9445 20.9445C19.4602 20.4288 19.7499 19.7293 19.7499 19H18.2499C18.2499 19.69 17.6899 20.25 16.9999 20.25V21.75ZM6.99991 20.25C6.30991 20.25 5.74991 19.69 5.74991 19H4.24991C4.24991 19.7293 4.53964 20.4288 5.05537 20.9445C5.57109 21.4603 6.27056 21.75 6.99991 21.75V20.25Z"
                        fill="black" />
                </svg>)
            case pathname === "/user/createticket":
                return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-4">
                    <path
                        d="M22 13V12C22 8.229 22 6.343 20.828 5.172C19.656 4.001 17.771 4 14 4H10C6.229 4 4.343 4 3.172 5.172C2.001 6.344 2 8.229 2 12C2 15.771 2 17.657 3.172 18.828C4.344 19.999 6.229 20 10 20H13"
                        stroke="black" strokeWidth="1.5"
                        strokeLinecap="round" />
                    <path opacity="0.4" d="M10 16H6M2 10H22" stroke="black"
                        strokeWidth="1.5" strokeLinecap="round" />
                    <path
                        d="M15.2727 17.4545H18.5454M18.5454 17.4545H21.8182M18.5454 17.4545V20.7272M18.5454 17.4545V14.1818"
                        stroke="black" strokeWidth="1.5"
                        strokeLinecap="round" />
                </svg>)
            case pathname.startsWith("/user/myticket"):
                return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-4">
                    <path
                        d="M22 13V12C22 8.229 22 6.343 20.828 5.172C19.656 4.001 17.771 4 14 4H10C6.229 4 4.343 4 3.172 5.172C2.001 6.344 2 8.229 2 12C2 15.771 2 17.657 3.172 18.828C4.344 19.999 6.229 20 10 20H13"
                        stroke="black" strokeWidth="1.5"
                        strokeLinecap="round" />
                    <path opacity="0.4" d="M10 16H6M2 10H22" stroke="black"
                        strokeWidth="1.5" strokeLinecap="round" />
                    <path
                        d="M18 20C19.6569 20 21 18.6569 21 17C21 15.3431 19.6569 14 18 14C16.3431 14 15 15.3431 15 17C15 18.6569 16.3431 20 18 20Z"
                        stroke="black" strokeWidth="1.5" />
                    <path d="M20.5 19.5L21.5 20.5" stroke="black"
                        strokeWidth="1.5" strokeLinecap="round" />
                </svg>);
            case pathname === "/user/mypage" || pathname === "/manager/mypage":
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-4">
                        <path
                            d="M9 10C11.2091 10 13 8.20914 13 6C13 3.79086 11.2091 2 9 2C6.79086 2 5 3.79086 5 6C5 8.20914 6.79086 10 9 10Z"
                            stroke="black" strokeWidth="1.5" />
                        <path opacity="0.5"
                            d="M12.5 4.341C12.8564 3.8041 13.3761 3.39621 13.9823 3.17772C14.5886 2.95922 15.249 2.94173 15.866 3.12784C16.4829 3.31394 17.0235 3.69375 17.4078 4.21104C17.7921 4.72833 17.9995 5.3556 17.9995 6C17.9995 6.6444 17.7921 7.27167 17.4078 7.78896C17.0235 8.30625 16.4829 8.68606 15.866 8.87216C15.249 9.05827 14.5886 9.04078 13.9823 8.82228C13.3761 8.60379 12.8564 8.1959 12.5 7.659"
                            stroke="black" strokeWidth="1.5" />
                        <path
                            d="M9 21C12.866 21 16 19.2091 16 17C16 14.7909 12.866 13 9 13C5.13401 13 2 14.7909 2 17C2 19.2091 5.13401 21 9 21Z"
                            stroke="black" strokeWidth="1.5" />
                        <path opacity="0.5"
                            d="M18 14C19.754 14.385 21 15.359 21 16.5C21 17.53 19.986 18.423 18.5 18.87"
                            stroke="black" strokeWidth="1.5"
                            strokeLinecap="round" />
                    </svg>
                );
            case pathname.startsWith("/manager/myticket"):
                return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-4">
                    <path
                        d="M2 12C2 8.229 2 6.343 3.172 5.172C4.344 4.001 6.229 4 10 4H14C17.771 4 19.657 4 20.828 5.172C21.999 6.344 22 8.229 22 12C22 15.771 22 17.657 20.828 18.828C19.656 19.999 17.771 20 14 20H10C6.229 20 4.343 20 3.172 18.828C2.001 17.656 2 15.771 2 12Z"
                        stroke="black" strokeWidth="1.5" />
                    <path opacity="0.5" d="M10 16H6M14 16H12.5M2 10H22"
                        stroke="black" strokeWidth="1.5"
                        strokeLinecap="round" />
                </svg>);
            case pathname.startsWith("/manager/departmentticket"):
                return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-4">
                    <path
                        d="M2 12C2 8.229 2 6.343 3.172 5.172C4.344 4.001 6.229 4 10 4H14C17.771 4 19.657 4 20.828 5.172C21.999 6.344 22 8.229 22 12C22 15.771 22 17.657 20.828 18.828C19.656 19.999 17.771 20 14 20H10C6.229 20 4.343 20 3.172 18.828C2.001 17.656 2 15.771 2 12Z"
                        stroke="black" strokeWidth="1.5" />
                    <path opacity="0.5" d="M10 16H6M14 16H12.5M2 10H22"
                        stroke="black" strokeWidth="1.5"
                        strokeLinecap="round" />
                </svg>);
            case pathname === "/manager/managerlist":
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-4">
                        <path 
                            d="M9 11C10.1046 11 11 10.1046 11 9C11 7.89543 10.1046 7 9 7C7.89543 7 7 7.89543 7 9C7 10.1046 7.89543 11 9 11Z"
                            stroke="black" strokeWidth="1.5" />
                        <path
                            d="M13 15C13 16.105 13 17 9 17C5 17 5 16.105 5 15C5 13.895 6.79 13 9 13C11.21 13 13 13.895 13 15Z"
                            stroke="black" strokeWidth="1.5" />
                        <path
                            d="M2 12C2 8.229 2 6.343 3.172 5.172C4.344 4.001 6.229 4 10 4H14C17.771 4 19.657 4 20.828 5.172C21.999 6.344 22 8.229 22 12C22 15.771 22 17.657 20.828 18.828C19.656 19.999 17.771 20 14 20H10C6.229 20 4.343 20 3.172 18.828C2.001 17.656 2 15.771 2 12Z"
                            stroke="black" strokeWidth="1.5" />
                        <path d="M19 12H15M19 9H14" stroke="black"
                            strokeWidth="1.5" strokeLinecap="round" />
                        <path opacity="0.9" d="M19 15H16" stroke="black"
                            strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                );
            case pathname.startsWith("/manager/monitoring"):
                return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-4">
                    <path
                        d="M2 12C2 7.286 2 4.929 3.464 3.464C4.93 2 7.286 2 12 2C16.714 2 19.071 2 20.535 3.464C22 4.93 22 7.286 22 12C22 16.714 22 19.071 20.535 20.535C19.072 22 16.714 22 12 22C7.286 22 4.929 22 3.464 20.535C2 19.072 2 16.714 2 12Z"
                        stroke="black" strokeWidth="1.5" />
                    <path opacity="0.5"
                        d="M7 14L9.293 11.707C9.48053 11.5195 9.73484 11.4142 10 11.4142C10.2652 11.4142 10.5195 11.5195 10.707 11.707L12.293 13.293C12.4805 13.4805 12.7348 13.5858 13 13.5858C13.2652 13.5858 13.5195 13.4805 13.707 13.293L17 10M17 10V12.5M17 10H14.5"
                        stroke="black" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round" />
                </svg>);
            case pathname.startsWith("/administer/memberlist"):
                return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-4">
                    <path
                        d="M9 10C11.2091 10 13 8.20914 13 6C13 3.79086 11.2091 2 9 2C6.79086 2 5 3.79086 5 6C5 8.20914 6.79086 10 9 10Z"
                        stroke="black" strokeWidth="1.5" />
                    <path opacity="0.5"
                        d="M12.5 4.341C12.8564 3.8041 13.3761 3.39621 13.9823 3.17772C14.5886 2.95922 15.249 2.94173 15.866 3.12784C16.4829 3.31394 17.0235 3.69375 17.4078 4.21104C17.7921 4.72833 17.9995 5.3556 17.9995 6C17.9995 6.6444 17.7921 7.27167 17.4078 7.78896C17.0235 8.30625 16.4829 8.68606 15.866 8.87216C15.249 9.05827 14.5886 9.04078 13.9823 8.82228C13.3761 8.60379 12.8564 8.1959 12.5 7.659"
                        stroke="black" strokeWidth="1.5" />
                    <path
                        d="M9 21C12.866 21 16 19.2091 16 17C16 14.7909 12.866 13 9 13C5.13401 13 2 14.7909 2 17C2 19.2091 5.13401 21 9 21Z"
                        stroke="black" strokeWidth="1.5" />
                    <path opacity="0.5"
                        d="M18 14C19.754 14.385 21 15.359 21 16.5C21 17.53 19.986 18.423 18.5 18.87"
                        stroke="black" strokeWidth="1.5"
                        strokeLinecap="round" />
                </svg>);
            case pathname === "/administer/memberenrollment":
                return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-4">
                    <path
                        d="M9 10C11.2091 10 13 8.20914 13 6C13 3.79086 11.2091 2 9 2C6.79086 2 5 3.79086 5 6C5 8.20914 6.79086 10 9 10Z"
                        stroke="black" strokeWidth="1.5" />
                    <path opacity="0.5"
                        d="M12.5 4.341C12.8564 3.8041 13.3761 3.39621 13.9823 3.17772C14.5886 2.95922 15.249 2.94173 15.866 3.12784C16.4829 3.31394 17.0235 3.69375 17.4078 4.21104C17.7921 4.72833 17.9995 5.3556 17.9995 6C17.9995 6.6444 17.7921 7.27167 17.4078 7.78896C17.0235 8.30625 16.4829 8.68606 15.866 8.87216C15.249 9.05827 14.5886 9.04078 13.9823 8.82228C13.3761 8.60379 12.8564 8.1959 12.5 7.659"
                        stroke="black" strokeWidth="1.5" />
                    <path
                        d="M9 21C12.866 21 16 19.2091 16 17C16 14.7909 12.866 13 9 13C5.13401 13 2 14.7909 2 17C2 19.2091 5.13401 21 9 21Z"
                        stroke="black" strokeWidth="1.5" />
                    <path opacity="0.5"
                        d="M18 14C19.754 14.385 21 15.359 21 16.5C21 17.53 19.986 18.423 18.5 18.87"
                        stroke="black" strokeWidth="1.5"
                        strokeLinecap="round" />
                </svg>);
            case pathname === "/administer/categorymanagement":
                return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-4">
                    <path
                        d="M2.5 17.5C2.5 15.614 2.5 14.672 3.086 14.086C3.672 13.5 4.614 13.5 6.5 13.5C8.386 13.5 9.328 13.5 9.914 14.086C10.5 14.672 10.5 15.614 10.5 17.5C10.5 19.386 10.5 20.328 9.914 20.914C9.328 21.5 8.386 21.5 6.5 21.5C4.614 21.5 3.672 21.5 3.086 20.914C2.5 20.328 2.5 19.386 2.5 17.5ZM13.5 6.5C13.5 4.614 13.5 3.672 14.086 3.086C14.672 2.5 15.614 2.5 17.5 2.5C19.386 2.5 20.328 2.5 20.914 3.086C21.5 3.672 21.5 4.614 21.5 6.5C21.5 8.386 21.5 9.328 20.914 9.914C20.328 10.5 19.386 10.5 17.5 10.5C15.614 10.5 14.672 10.5 14.086 9.914C13.5 9.328 13.5 8.386 13.5 6.5Z"
                        stroke="black" strokeWidth="1.5" />
                    <path
                        d="M2.5 6.5C2.5 5.43913 2.92143 4.42172 3.67157 3.67157C4.42172 2.92143 5.43913 2.5 6.5 2.5C7.56087 2.5 8.57828 2.92143 9.32843 3.67157C10.0786 4.42172 10.5 5.43913 10.5 6.5C10.5 7.56087 10.0786 8.57828 9.32843 9.32843C8.57828 10.0786 7.56087 10.5 6.5 10.5C5.43913 10.5 4.42172 10.0786 3.67157 9.32843C2.92143 8.57828 2.5 7.56087 2.5 6.5Z"
                        stroke="black" strokeWidth="1.5" />
                    <path opacity="0.5"
                        d="M13.5 17.5C13.5 16.4391 13.9214 15.4217 14.6716 14.6716C15.4217 13.9214 16.4391 13.5 17.5 13.5C18.5609 13.5 19.5783 13.9214 20.3284 14.6716C21.0786 15.4217 21.5 16.4391 21.5 17.5C21.5 18.5609 21.0786 19.5783 20.3284 20.3284C19.5783 21.0786 18.5609 21.5 17.5 21.5C16.4391 21.5 15.4217 21.0786 14.6716 20.3284C13.9214 19.5783 13.5 18.5609 13.5 17.5Z"
                        stroke="black" strokeWidth="1.5" />
                </svg>);
            case pathname === "/administer/log":
                return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-4">
                    <path
                        d="M4 12H4.01M4 6H4.01M4 18H4.01M8 18H10M8 12H10M8 6H10M14 6H20M14 12H20M14 18H20"
                        stroke="black" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round" />
                </svg>)
            default:
                return "";
        }
    })();


    return (
        <div className="text-black font-semibold flex items-center">

            {pageIcon}

            {pageTitle}
        </div>
    )
}

export default PageTitle