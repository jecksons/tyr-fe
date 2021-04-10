export default function Config(){
    const env = process.env.NODE_ENV || 'development';
   
    const cfgBase = {
        development: {
            apiURL: 'http://192.168.0.11:3000'            
        },
        production: {
            apiURL: 'https://tyr-be.herokuapp.com'
        }
    };

    return cfgBase[env];
}