export default function Config(){
    const env = process.env.NODE_ENV || 'development';
   
    const cfgBase = {
        development: {
            apiURL: 'https://tyr-be.herokuapp.com'            
        },
        production: {
            apiURL: 'https://tyr-be.herokuapp.com'
        }
    };

    //apiURL: 'http://localhost:3000'
    
    return cfgBase[env];
}