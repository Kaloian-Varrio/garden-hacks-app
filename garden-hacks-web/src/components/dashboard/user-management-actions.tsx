"use client";

export function AddUserButton() {
    return (
        <button
            onClick={() => {
                alert("TODO: API support for adding users is not yet implemented.");
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#c4e6e9] bg-[#f2fbff] px-4 text-sm font-semibold text-[#0a5a60] hover:bg-[#e2f7ff]"
        >
            Add user
        </button>
    );
}

export function UserActions({ userId }: { userId: number }) {
    return (
        <div className="flex gap-2">
            <button
                onClick={() => {
                    alert(`TODO: API support for editing user ${userId} is not yet implemented.`);
                }}
                className="inline-flex min-h-8 items-center justify-center rounded-md border border-[#b7c8ad] bg-white px-3 text-xs font-semibold text-[#203525] hover:bg-[#f1f7ed]"
            >
                Edit
            </button>
            <button
                onClick={() => {
                    if (window.confirm("Are you sure you want to delete this user? This cannot be undone.")) {
                        alert(`TODO: API support for deleting user ${userId} is not yet implemented.`);
                    }
                }}
                className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md border border-[#ffc2ad] bg-white px-3 text-xs font-bold text-[#a33a20] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fff0eb]"
            >
                Delete
            </button>
        </div>
    );
}