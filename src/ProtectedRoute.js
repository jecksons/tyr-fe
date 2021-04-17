
import Login from './components/pages/Login';

export default function ProtectedRoute(props){
    if (props.userData && props.userData.isLogged && props.userData.businessID > 0) {
        return <props.component userData={props.userData} match={props.computedMatch}/>;
    } else return <Login />;

}