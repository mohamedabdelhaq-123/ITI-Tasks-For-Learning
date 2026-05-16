<?php

// BOOTSTRAP THE APPLICATION (instance) after THE AUTOLOADER HAS BEEN REGISTERED in public/index.php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();



// const app = express();
// app.use('/', webRoutes);         // -> withRouting()
// app.use(globalMiddleware);       // -> withMiddleware()
// app.use(errorHandler);           // -> withExceptions()

// export default app;              // -> return ... ->create()



// [ public/index.php ] 
//        | 
//        | (requires)
//        v
// +-- [ bootstrap/app.php ] -----------------------------------+
// |  1. configure()    -> Sets the base path                   |
// |  2. withRouting()  -> Attaches the 🚦 Traffic Cops         |
// |  3. withMiddleware()-> Configures the 🛡️ Guards (Kernel)   |
// |  4. withExceptions()-> Centralizes Error Handling          |
// |  5. create()       -> Builds and returns the $app object   |
// +------------------------------------------------------------+
//        |
//        | (returns $app)
//        v
// [ public/index.php ] -> Executes the request through the app