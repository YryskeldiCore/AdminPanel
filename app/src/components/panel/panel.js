import React from 'react'

const Panel = () => {
    return (
        <div>
            <div className="panel">
                <button className="uk-button uk-button-primary uk-margin-small-right" uk-toggle="target: #modal-open">Open</button>
                <button className="uk-button uk-button-secondary uk-margin-small-left" uk-toggle="target: #modal-save">Save</button>
                <button className="uk-button uk-button-secondary uk-margin-small-left" uk-toggle="target: #modal-backup">Backup</button>
                <button className="uk-button uk-button-secondary uk-margin-small-left" uk-toggle="target: #modal-meta">Edit meta</button>
                <button className="uk-button uk-button-secondary uk-margin-small-left" uk-toggle="target: #modal-logout">Exit</button>
            </div>
        </div>
    )
}

export default Panel;
