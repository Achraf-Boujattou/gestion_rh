
# 📄 Leaves Module Guide

This guide instructs the AI agent or developer on how to execute the **Leaves Management** task according to the provided specifications.

---

## 🎯 Objective

Develop and integrate a **Leave Management System** allowing employees to:
- Submit leave requests.
- View leave status.
- Allow leaders/admin to approve/reject requests.
- Notify users of decisions.

---

## 🛠️ Modules Involved

- `EmployeeController`
- `LeaveController`
- `NotificationController` (for informing users)
- `LeaveRequest` Model
- `LeaveRequestForm` (React/Inertia Form)
- Permissions middleware (`role:admin`, `role:leader`, `role:employee`)

---

## 🧩 Features to Implement

### 1. Leave Request Form (Frontend)

- Form for employees (date start, end, reason).
- Use React + Inertia.js.
- Form validation.
- Submit to `/leaves` POST route.

### 2. Backend Routes (Laravel)

```php
Route::middleware(['auth'])->group(function () {
    Route::resource('leaves', LeaveController::class);
});
```

### 3. Database Migration

```php
Schema::create('leaves', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->date('start_date');
    $table->date('end_date');
    $table->text('reason');
    $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
    $table->timestamps();
});
```

### 4. Controller Logic

- Store a request with status `pending`.
- Leader/Admin can approve/reject.
- Notify employee using Laravel Notification or database-based system.

### 5. Dashboard Integration

- Employees: show list of leave requests and their status.
- Leaders/Admins: view and manage team requests.

---

## ✅ Done When

- Employees can request leave.
- Leaders/Admin can approve/reject.
- Notifications are sent.
- All roles have correct permissions.
- Data validated & secure.

---

## 📦 Deployment & Testing

- Run migrations: `php artisan migrate`
- Seed demo data if necessary.
- Manual testing + automated (Feature + Unit tests).

---

## 📁 File Structure Example

```
app/
├── Http/Controllers/LeaveController.php
├── Models/Leave.php
resources/js/Pages/Leaves/
├── Index.jsx
├── Create.jsx
routes/web.php
database/migrations/xxxx_xx_xx_create_leaves_table.php
```

---

## ℹ️ Notes

Ensure the system respects department restrictions: a Leader only sees leaves from their team.

