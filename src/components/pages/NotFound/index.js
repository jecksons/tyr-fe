import './notfound.css';
import Config from '../../../services/config';

export default function NotFound() {
    return (
        <div id="notfound">
            <strong id="message">Ooops! A página não existe!</strong>
            <p>{Config().apiURL}</p>
        </div>
    )
}