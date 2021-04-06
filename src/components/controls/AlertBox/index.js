import './alertbox.css';


export default function AlertBox(msg){


    return (
        <div className="alert-box">
            <strong className="alert-message">{msg.msg}</strong>
        </div>
    );
}