import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Login from "./Login";
import Dashboard from "./Dashboard";

const AdminApp = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-white text-center mt-20">Loading Admin...</div>;
  }

  return (
    <div className="min-h-screen text-white pt-10 px-5 relative z-10">
      {!session ? <Login /> : <Dashboard session={session} />}
    </div>
  );
};

export default AdminApp;
