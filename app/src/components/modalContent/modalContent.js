import React from 'react'

const ModalContent = ({modal, target, data, redirect}) => {

    const List = data.map(item => {
        if(item.time){
            return (
                <li key={item.file}>
                    <a className="uk-link-muted" href="#"
                    onClick={(e) => redirect(e, item.file)}>Резервная копия от: {item.time}</a>
                </li>
            )
        } else {
            return (
                <li key={item}>
                    <a className="uk-link-muted" href="#"
                    onClick={(e) => redirect(e, item)}>{item}</a>
                </li>
            )
        }
    })
    
    let msg;
    if(data.length < 1){
        msg = <div>Резервные копии не найдены!</div>
    }

    return (
        <div>
            <div>
                <div id={target} uk-modal={modal.toString()} container="false">
                    <div className="uk-modal-dialog uk-modal-body uk-modal-close">
                        {msg}
                        <ul className="uk-list">
                            {List}
                        </ul>
                        <p className="uk-text-right">
                            <button className="uk-button uk-button-default uk-modal-close" type="button">Отменить</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalContent;
