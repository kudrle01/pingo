import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import type { ReactNode } from "react";

import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import CreateQuiz from "@/pages/CreateQuiz";
import EditQuiz from "@/pages/EditQuiz";
import QuizDetail from "@/pages/QuizDetail";
import HostGame from "@/pages/HostGame";
import JoinGame from "@/pages/JoinGame";
import PlayGame from "@/pages/PlayGame";
import Results from "@/pages/Results";
import History from "@/pages/History";
import Settings from "@/pages/Settings";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen-dvh flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreateQuiz /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/quiz/:id" element={<ProtectedRoute><QuizDetail /></ProtectedRoute>} />
        <Route path="/quiz/:id/edit" element={<ProtectedRoute><EditQuiz /></ProtectedRoute>} />
        <Route path="/host/:gameId" element={<HostGame />} />
        <Route path="/join" element={<JoinGame />} />
        <Route path="/play/:gameId" element={<PlayGame />} />
        <Route path="/results/:gameId" element={<Results />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
