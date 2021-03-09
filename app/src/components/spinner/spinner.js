import React from 'react'

const Spinner = ({active}) => {
    return (
        <div className={active? 'spinner active': 'spinner'}>
            <span uk-spinner="ratio: 4.5"></span>
        </div>
    )
}

export default Spinner
