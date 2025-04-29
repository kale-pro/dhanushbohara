<?php
session_start();

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "login_system";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Handle login
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['login'])) {
    $usernameOrEmail = $_POST['loginUsernameOrEmail'];
    $password = $_POST['loginPassword'];

    $stmt = $conn->prepare("SELECT * FROM users WHERE username = :username OR email = :email");
    $stmt->execute(['username' => $usernameOrEmail, 'email' => $usernameOrEmail]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        header("Location: https://www.dhanushbohara.com.np/");
        exit();
    } else {
        $error = "Invalid credentials!";
    }
}

// Handle registration
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['register'])) {
    $fullName = $_POST['registerFullName'];
    $username = $_POST['registerUsername'];
    $email = $_POST['registerEmail'];
    $phone = $_POST['registerPhone'];
    $password = password_hash($_POST['registerPassword'], PASSWORD_DEFAULT);

    // Check if email or username exists
    $stmt = $conn->prepare("SELECT COUNT(*) FROM users WHERE email = :email OR username = :username");
    $stmt->execute(['email' => $email, 'username' => $username]);
    
    if ($stmt->fetchColumn() > 0) {
        $error = "Email or username already exists!";
    } else {
        $stmt = $conn->prepare("INSERT INTO users (full_name, username, email, phone, password) 
                               VALUES (:full_name, :username, :email, :phone, :password)");
        $stmt->execute([
            'full_name' => $fullName,
            'username' => $username,
            'email' => $email,
            'phone' => $phone,
            'password' => $password
        ]);
        $success = "Registration successful! Please login.";
    }
}

// Handle forgot password
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['forgotPassword'])) {
    $email = $_POST['forgotEmail'];
    
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    
    if ($stmt->fetch()) {
        $resetCode = rand(100000, 999999);
        $_SESSION['reset_code'] = $resetCode;
        $_SESSION['reset_email'] = $email;
        
        // In a real application, you would send an email here
        $success = "Reset code sent! Code: $resetCode"; // For demo purposes
    } else {
        $error = "Email not found!";
    }
}

// Handle reset password
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['resetPassword'])) {
    $code = $_POST['resetCode'];
    $newPassword = password_hash($_POST['newPassword'], PASSWORD_DEFAULT);
    
    if (isset($_SESSION['reset_code']) && $_SESSION['reset_code'] == $code) {
        $stmt = $conn->prepare("UPDATE users SET password = :password WHERE email = :email");
        $stmt->execute([
            'password' => $newPassword,
            'email' => $_SESSION['reset_email']
        ]);
        
        unset($_SESSION['reset_code']);
        unset($_SESSION['reset_email']);
        $success = "Password reset successful! Please login.";
    } else {
        $error = "Invalid reset code!";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login & Register</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>
        /* Original styles remain unchanged */
        body {
            background: linear-gradient(135deg, #0A0A23 0%, #1A1A3A 100%);
            position: relative;
            overflow: hidden;
        }
        .galaxy-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
        .galaxy-bg::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(75, 0, 130, 0.2) 0%, rgba(0, 0, 50, 0) 70%);
            opacity: 0.3;
            animation: nebulaMove 60s linear infinite;
        }
        @keyframes nebulaMove {
            0% { transform: translate(0, 0); background: radial-gradient(circle, rgba(75, 0, 130, 0.2) 0%, rgba(0, 0, 50, 0) 70%); }
            50% { background: radial-gradient(circle, rgba(0, 0, 150, 0.2) 0%, rgba(0, 0, 50, 0) 70%); }
            100% { transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(75, 0, 130, 0.2) 0%, rgba(0, 0, 50, 0) 70%); }
        }
        .stars {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        .stars span {
            position: absolute;
            background: white;
            border-radius: 50%;
            animation: twinkle 5s infinite, moveStar 30s linear infinite;
            opacity: 0.8;
        }
        .stars span:nth-child(1) { width: 2px; height: 2px; top: 5%; left: 10%; animation-delay: 0.1s; }
        .stars span:nth-child(2) { width: 3px; height: 3px; top: 15%; left: 20%; animation-delay: 0.5s; }
        .stars span:nth-child(3) { width: 1px; height: 1px; top: 25%; left: 30%; animation-delay: 1s; }
        .stars span:nth-child(4) { width: 2px; height: 2px; top: 35%; left: 40%; animation-delay: 1.5s; }
        .stars span:nth-child(5) { width: 3px; height: 3px; top: 45%; left: 50%; animation-delay: 2s; }
        .stars span:nth-child(6) { width: 1px; height: 1px; top: 55%; left: 60%; animation-delay: 2.5s; }
        .stars span:nth-child(7) { width: 2px; height: 2px; top: 65%; left: 70%; animation-delay: 3s; }
        .stars span:nth-child(8) { width: 3px; height: 3px; top: 75%; left: 80%; animation-delay: 3.5s; }
        .stars span:nth-child(9) { width: 1px; height: 1px; top: 85%; left: 90%; animation-delay: 4s; }
        .stars span:nth-child(10) { width: 2px; height: 2px; top: 95%; left: 5%; animation-delay: 4.5s; }
        .stars span:nth-child(11) { width: 1px; height: 1px; top: 10%; left: 15%; animation-delay: 0.2s; }
        .stars span:nth-child(12) { width: 2px; height: 2px; top: 20%; left: 25%; animation-delay: 0.7s; }
        .stars span:nth-child(13) { width: 3px; height: 3px; top: 30%; left: 35%; animation-delay: 1.2s; }
        .stars span:nth-child(14) { width: 1px; height: 1px; top: 40%; left: 45%; animation-delay: 1.7s; }
        .stars span:nth-child(15) { width: 2px; height: 2px; top: 50%; left: 55%; animation-delay: 2.2s; }
        .stars span:nth-child(16) { width: 3px; height: 3px; top: 60%; left: 65%; animation-delay: 2.7s; }
        .stars span:nth-child(17) { width: 1px; height: 1px; top: 70%; left: 75%; animation-delay: 3.2s; }
        .stars span:nth-child(18) { width: 2px; height: 2px; top: 80%; left: 85%; animation-delay: 3.7s; }
        .stars span:nth-child(19) { width: 3px; height: 3px; top: 90%; left: 95%; animation-delay: 4.2s; }
        .stars span:nth-child(20) { width: 1px; height: 1px; top: 5%; left: 25%; animation-delay: 4.7s; }
        @keyframes twinkle {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 0.2; }
        }
        @keyframes moveStar {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-100vw, 100vh); }
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOut {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(-100%); }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .slide-in { animation: slideIn 0.5s ease-out forwards; }
        .slide-out { animation: slideOut 0.5s ease-out forwards; }
        .fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .btn-hover:hover {
            transition: all 0.3s ease-in-out;
            transform: scale(1.05);
            background-color: #111827;
        }
        .social-btn-hover:hover {
            transition: all 0.3s ease-in-out;
            transform: scale(1.05);
            background-color: #f3f4f6;
        }
        .divider {
            display: flex;
            align-items: center;
            text-align: center;
            color: #6b7280;
            margin: 20px 0;
        }
        .divider::before,
        .divider::after {
            content: '';
            flex: 1;
            border-bottom: 1px solid #d1d5db;
        }
        .divider::before { margin-right: 10px; }
        .divider::after { margin-left: 10px; }
        .input-field {
            border-radius: 8px;
            padding: 12px;
            border: 1px solid #d1d5db;
            width: 100%;
        }
        .input-pink {
            border: 1px solid #f9a8d4;
        }
        .form-container {
            background: rgba(255, 255, 255, 0.9);
            border-radius: 12px;
        }
    </style>
</head>
<body class="flex items-center justify-center min-h-screen">
    <div class="galaxy-bg">
        <div class="stars">
            <span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span><span></span>
        </div>
    </div>

    <?php if (isset($error)): ?>
        <div class="absolute top-4 w-full max-w-sm">
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
                <?php echo $error; ?>
            </div>
        </div>
    <?php endif; ?>

    <?php if (isset($success)): ?>
        <div class="absolute top-4 w-full max-w-sm">
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded" role="alert">
                <?php echo $success; ?>
            </div>
        </div>
    <?php endif; ?>

    <div id="loginForm" class="w-full max-w-sm">
        <div class="form-container p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Login</h2>
            <button onclick="handleGoogleLogin()" class="w-full bg-gray-100 text-gray-700 py-3 rounded-lg social-btn-hover flex items-center justify-center gap-2 mb-3">
                <i class="fab fa-google text-red-500"></i> Continue with Google
            </button>
            <button onclick="handleFacebookLogin()" class="w-full bg-gray-100 text-gray-700 py-3 rounded-lg social-btn-hover flex items-center justify-center gap-2 mb-3">
                <i class="fab fa-facebook-f text-blue-600"></i> Continue with Facebook
            </button>
            <div class="divider text-sm">or sign in with email</div>
            <form method="POST">
                <input type="hidden" name="login" value="1">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm mb-2" for="loginUsernameOrEmail">Username or Email</label>
                    <input type="text" id="loginUsernameOrEmail" name="loginUsernameOrEmail" class="input-field input-pink" required>
                </div>
                <div class="mb-6 flex justify-between items-center">
                    <div class="w-full">
                        <label class="block text-gray-700 text-sm mb-2" for="loginPassword">Password</label>
                        <input type="password" id="loginPassword" name="loginPassword" class="input-field" required>
                    </div>
                    <a href="#" onclick="showForgotPassword()" class="text-sm text-blue-600 hover:underline ml-2 mt-6">Forgot?</a>
                </div>
                <button type="submit" class="w-full bg-gray-900 text-white py-3 rounded-lg btn-hover">Login</button>
            </form>
            <div class="text-center mt-4">
                <button onclick="showRegister()" class="w-full bg-gray-600 text-white py-3 rounded-lg btn-hover">Register</button>
            </div>
        </div>
    </div>

    <div id="registerForm" class="w-full max-w-sm hidden">
        <div class="form-container p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Register</h2>
            <form method="POST">
                <input type="hidden" name="register" value="1">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm mb-2" for="registerFullName">Full Name</label>
                    <input type="text" id="registerFullName" name="registerFullName" class="input-field" required>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm mb-2" for="registerUsername">Username</label>
                    <input type="text" id="registerUsername" name="registerUsername" class="input-field" required>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm mb-2" for="registerEmail">Email</label>
                    <input type="email" id="registerEmail" name="registerEmail" class="input-field" required>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm mb-2" for="registerPhone">Phone Number</label>
                    <input type="tel" id="registerPhone" name="registerPhone" class="input-field" pattern="[0-9]{10}" required>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm mb-2" for="registerPassword">Password</label>
                    <input type="password" id="registerPassword" name="registerPassword" class="input-field" required>
                </div>
                <div class="mb-6">
                    <label class="block text-gray-700 text-sm mb-2" for="registerConfirmPassword">Confirm Password</label>
                    <input type="password" id="registerConfirmPassword" name="registerConfirmPassword" class="input-field" required>
                </div>
                <button type="submit" class="w-full bg-gray-900 text-white py-3 rounded-lg btn-hover">Register</button>
            </form>
            <div class="text-center mt-4">
                <a href="#" onclick="showLogin()" class="text-sm text-blue-600 hover:underline">Already have an account? Sign in</a>
            </div>
        </div>
    </div>

    <div id="forgotPasswordForm" class="w-full max-w-sm hidden">
        <div class="form-container p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Forgot Password</h2>
            <form method="POST">
                <input type="hidden" name="forgotPassword" value="1">
                <div class="mb-6">
                    <label class="block text-gray-700 text-sm mb-2" for="forgotEmail">Email</label>
                    <input type="email" id="forgotEmail" name="forgotEmail" class="input-field" required>
                </div>
                <button type="submit" class="w-full bg-gray-900 text-white py-3 rounded-lg btn-hover">Send Reset Link</button>
            </form>
            <div class="text-center mt-4">
                <a href="#" onclick="showLogin()" class="text-sm text-blue-600 hover:underline">Back to Login</a>
            </div>
        </div>
    </div>

    <div id="resetPasswordForm" class="w-full max-w-sm hidden">
        <div class="form-container p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Reset Password</h2>
            <form method="POST">
                <input type="hidden" name="resetPassword" value="1">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm mb-2" for="resetCode">Verification Code</label>
                    <input type="text" id="resetCode" name="resetCode" class="input-field" required>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm mb-2" for="newPassword">New Password</label>
                    <input type="password" id="newPassword" name="newPassword" class="input-field" required>
                </div>
                <div class="mb-6">
                    <label class="block text-gray-700 text-sm mb-2" for="confirmNewPassword">Confirm New Password</label>
                    <input type="password" id="confirmNewPassword" name="confirmNewPassword" class="input-field" required>
                </div>
                <button type="submit" class="w-full bg-gray-900 text-white py-3 rounded-lg btn-hover">Reset Password</button>
            </form>
            <div class="text-center mt-4">
                <a href="#" onclick="showLogin()" class="text-sm text-blue-600 hover:underline">Back to Login</a>
            </div>
        </div>
    </div>

    <script>
        function showLogin() {
            const forms = [
                document.getElementById('loginForm'),
                document.getElementById('registerForm'),
                document.getElementById('forgotPasswordForm'),
                document.getElementById('resetPasswordForm')
            ];
            forms.forEach((form, index) => {
                if (!form.classList.contains('hidden') && index !== 0) {
                    form.classList.add('slide-out');
                    setTimeout(() => {
                        form.classList.add('hidden');
                        form.classList.remove('slide-out');
                        forms[0].classList.remove('hidden');
                        forms[0].classList.add('slide-in');
                    }, 500);
                }
            });
        }

        function showRegister() {
            const forms = [
                document.getElementById('loginForm'),
                document.getElementById('registerForm'),
                document.getElementById('forgotPasswordForm'),
                document.getElementById('resetPasswordForm')
            ];
            forms.forEach((form, index) => {
                if (!form.classList.contains('hidden')) {
                    form.classList.add('slide-out');
                    setTimeout(() => {
                        form.classList.add('hidden');
                        form.classList.remove('slide-out');
                        forms[1].classList.remove('hidden');
                        forms[1].classList.add('slide-in');
                    }, 500);
                }
            });
        }

        function showForgotPassword() {
            const forms = [
                document.getElementById('loginForm'),
                document.getElementById('registerForm'),
                document.getElementById('forgotPasswordForm'),
                document.getElementById('resetPasswordForm')
            ];
            forms.forEach((form, index) => {
                if (!form.classList.contains('hidden')) {
                    form.classList.add('slide-out');
                    setTimeout(() => {
                        form.classList.add('hidden');
                        form.classList.remove('slide-out');
                        forms[2].classList.remove('hidden');
                        forms[2].classList.add('fade-in');
                    }, 500);
                }
            });
        }

        function showResetPassword() {
            const forms = [
                document.getElementById('loginForm'),
                document.getElementById('registerForm'),
                document.getElementById('forgotPasswordForm'),
                document.getElementById('resetPasswordForm')
            ];
            forms.forEach((form, index) => {
                if (!form.classList.contains('hidden')) {
                    form.classList.add('slide-out');
                    setTimeout(() => {
                        form.classList.add('hidden');
                        form.classList.remove('slide-out');
                        forms[3].classList.remove('hidden');
                        forms[3].classList.add('fade-in');
                    }, 500);
                }
            });
        }

        // Placeholder for social login (implement actual OAuth in production)
        function handleGoogleLogin() {
            alert("Google login not implemented in this demo");
        }

        function handleFacebookLogin() {
            alert("Facebook login not implemented in this demo");
        }
    </script>
</body>
</html>