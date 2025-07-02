import React from "react";

const NotFound = () => {
    return (
        <>

            <h1 className="large text-primary">Page Not Found</h1>
            <p className="lead">
                <i className="fas fa-exclamation-triangle"></i> Sorry, this page does not exist
            </p>
            <p>
                <a href="/"><i className="fas fa-home"></i> Go Back Home</a>
            </p>

        </>
    );
}

export default NotFound;