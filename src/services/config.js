export default function Config(){
    let env = process.env.NODE_ENV || 'development';
   
    const dev_prod = process.env.REACT_APP_DEV_PROD || 'N';

    if (dev_prod === 'Y') {
        env = 'production';
    };


    const cfgBase = {        
        development: {
            apiURL: 'http://192.168.0.11:3000',
            original_env: env
        },
        production: {
            apiURL: 'https://tyr-be.herokuapp.com',
            original_env: env
        }
    };

    return cfgBase[env];
}