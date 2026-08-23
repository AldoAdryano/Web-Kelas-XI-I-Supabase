import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const ChatModeration = () => {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    const { data } = await supabase.from("chats").select("*").order("createdAt", { ascending: false }).limit(50);
    setChats(data || []);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus pesan ini?")) {
      await supabase.from("chats").delete().eq("id", id);
      fetchChats();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Moderasi Chat (50 Terakhir)</h2>
      <div className="flex flex-col gap-2">
        {chats.map(c => (
          <div key={c.id} className="bg-gray-800 p-3 rounded flex justify-between items-center border border-gray-700">
            <div>
              <span className="font-bold text-blue-400 mr-2">{c.is_admin ? "Admin" : "Anonim"}</span>
              <span>{c.text}</span>
            </div>
            <button onClick={() => handleDelete(c.id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium">Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ScheduleModeration = () => {
  const [dayId, setDayId] = useState(1);
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({ subject: "", time_start: "", time_end: "", order_index: "" });

  const fetchSchedules = async () => {
    const { data } = await supabase.from("schedules").select("*").eq("day_id", dayId).order("order_index", { ascending: true });
    setSchedules(data || []);
  };

  useEffect(() => {
    fetchSchedules();
  }, [dayId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    await supabase.from("schedules").insert({ ...form, day_id: dayId });
    setForm({ subject: "", time_start: "", time_end: "", order_index: "" });
    fetchSchedules();
  };

  const handleDelete = async (id) => {
    if (confirm("Hapus jadwal ini?")) {
      await supabase.from("schedules").delete().eq("id", id);
      fetchSchedules();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Jadwal Mapel</h2>
        <select value={dayId} onChange={(e) => setDayId(Number(e.target.value))} className="bg-gray-800 border border-gray-600 rounded p-2 text-white outline-none">
          <option value={1}>Senin</option><option value={2}>Selasa</option>
          <option value={3}>Rabu</option><option value={4}>Kamis</option>
          <option value={5}>Jumat</option><option value={6}>Sabtu</option>
        </select>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6 bg-gray-800 p-4 rounded border border-gray-700">
        <input required type="text" placeholder="Mata Pelajaran" className="p-2 rounded bg-gray-700 flex-1 outline-none text-white" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
        <input required type="text" placeholder="Mulai (07.00)" className="p-2 rounded bg-gray-700 w-28 outline-none text-white" value={form.time_start} onChange={e => setForm({...form, time_start: e.target.value})} />
        <input required type="text" placeholder="Selesai (08.30)" className="p-2 rounded bg-gray-700 w-28 outline-none text-white" value={form.time_end} onChange={e => setForm({...form, time_end: e.target.value})} />
        <input required type="number" placeholder="Urutan (1)" className="p-2 rounded bg-gray-700 w-24 outline-none text-white" value={form.order_index} onChange={e => setForm({...form, order_index: e.target.value})} />
        <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 rounded font-bold">+</button>
      </form>

      <div className="flex flex-col gap-2">
        {schedules.map(s => (
          <div key={s.id} className="bg-gray-800 p-3 rounded flex justify-between border border-gray-700 items-center">
            <div>
              <span className="font-bold mr-2 text-yellow-400">#{s.order_index}</span>
              <span className="font-semibold mr-4">{s.subject}</span>
              <span className="text-gray-400 text-sm">{s.time_start} - {s.time_end}</span>
            </div>
            <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-400 font-medium">Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const PiketModeration = () => {
  const [dayId, setDayId] = useState(1);
  const [pikets, setPikets] = useState([]);
  const [form, setForm] = useState({ student_name: "", order_index: "" });

  const fetchPikets = async () => {
    const { data } = await supabase.from("piket").select("*").eq("day_id", dayId).order("order_index", { ascending: true });
    setPikets(data || []);
  };

  useEffect(() => {
    fetchPikets();
  }, [dayId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    await supabase.from("piket").insert({ ...form, day_id: dayId });
    setForm({ student_name: "", order_index: "" });
    fetchPikets();
  };

  const handleDelete = async (id) => {
    if (confirm("Hapus nama ini?")) {
      await supabase.from("piket").delete().eq("id", id);
      fetchPikets();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Jadwal Piket</h2>
        <select value={dayId} onChange={(e) => setDayId(Number(e.target.value))} className="bg-gray-800 border border-gray-600 rounded p-2 text-white outline-none">
          <option value={1}>Senin</option><option value={2}>Selasa</option>
          <option value={3}>Rabu</option><option value={4}>Kamis</option>
          <option value={5}>Jumat</option><option value={6}>Sabtu</option>
        </select>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6 bg-gray-800 p-4 rounded border border-gray-700">
        <input required type="text" placeholder="Nama Siswa" className="p-2 rounded bg-gray-700 flex-1 outline-none text-white" value={form.student_name} onChange={e => setForm({...form, student_name: e.target.value})} />
        <input required type="number" placeholder="Urutan (1)" className="p-2 rounded bg-gray-700 w-24 outline-none text-white" value={form.order_index} onChange={e => setForm({...form, order_index: e.target.value})} />
        <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 rounded font-bold">+</button>
      </form>

      <div className="flex flex-col gap-2">
        {pikets.map(p => (
          <div key={p.id} className="bg-gray-800 p-3 rounded flex justify-between border border-gray-700 items-center">
            <div>
              <span className="font-bold mr-2 text-yellow-400">#{p.order_index}</span>
              <span className="font-semibold">{p.student_name}</span>
            </div>
            <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-400 font-medium">Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const GalleryModeration = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    // Ambil gambar dari bucket uploads (yang belum disetujui)
    const { data, error } = await supabase.storage.from("uploads").list();
    if (data) {
      // Hapus file placeholder tersembunyi milik supabase (.emptyFolderPlaceholder)
      setImages(data.filter((f) => f.name !== ".emptyFolderPlaceholder"));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleApprove = async (fileName) => {
    try {
      Swal.fire({ title: "Memproses...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      
      // 1. Download dari uploads
      const { data: fileData, error: downloadError } = await supabase.storage.from("uploads").download(fileName);
      if (downloadError) throw downloadError;

      // 2. Upload ke gallery
      const { error: uploadError } = await supabase.storage.from("gallery").upload(fileName, fileData);
      if (uploadError) throw uploadError;

      // 3. Hapus dari uploads
      await supabase.storage.from("uploads").remove([fileName]);

      Swal.fire({ icon: "success", title: "Gambar Disetujui!", text: "Gambar telah dipindahkan ke Gallery utama.", timer: 2000, showConfirmButton: false });
      fetchImages();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleReject = async (fileName) => {
    if (confirm("Tolak dan hapus gambar ini secara permanen?")) {
      await supabase.storage.from("uploads").remove([fileName]);
      fetchImages();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Moderasi Permintaan Gambar</h2>
        <button onClick={fetchImages} className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">Refresh</button>
      </div>
      
      {loading ? (
        <p className="text-center py-10 opacity-50">Memuat gambar...</p>
      ) : images.length === 0 ? (
        <div className="text-center py-10 bg-gray-800 rounded border border-gray-700">
          <p className="text-gray-400">Tidak ada permintaan gambar baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.name} className="bg-gray-800 rounded border border-gray-700 overflow-hidden flex flex-col">
              <img 
                src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/uploads/${img.name}`} 
                alt="Request" 
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <p className="text-xs text-gray-400 truncate mb-3" title={img.name}>{img.name}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(img.name)} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-1 rounded">Setujui</button>
                  <button onClick={() => handleReject(img.name)} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-1 rounded">Tolak</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StructureModeration = () => {
  const [roles, setRoles] = useState([]);

  const fetchRoles = async () => {
    const { data } = await supabase.from("class_roles").select("*").order("id", { ascending: true });
    setRoles(data || []);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleUpdate = async (id, newName) => {
    await supabase.from("class_roles").update({ student_name: newName }).eq("id", id);
    fetchRoles();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Edit Struktur Kelas</h2>
      <div className="flex flex-col gap-2">
        {roles.map(r => (
          <div key={r.id} className="bg-gray-800 p-3 rounded flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-700 gap-2">
            <div className="flex flex-col">
              <span className="font-bold text-blue-400">{r.label || "Jabatan Tambahan"}</span>
              <span className="text-xs text-gray-500 font-mono">{r.role_key}</span>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input 
                type="text" 
                defaultValue={r.student_name}
                onBlur={(e) => {
                  if (e.target.value !== r.student_name) {
                    handleUpdate(r.id, e.target.value);
                  }
                }}
                className="p-2 rounded bg-gray-700 text-white outline-none flex-1 border border-gray-600 focus:border-blue-500"
              />
            </div>
          </div>
        ))}
        <p className="text-xs text-gray-400 mt-2">*Perubahan nama akan otomatis tersimpan ketika Anda mengeklik di luar kotak isian (hilang fokus).</p>
      </div>
    </div>
  );
};

const Dashboard = ({ session }) => {
  const [activeTab, setActiveTab] = useState("chats");
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4 mt-5">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4 items-center">
          <Link to="/" className="text-blue-400 hover:underline text-sm font-medium">Halaman Utama</Link>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-bold">Logout</button>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-700 pb-2 overflow-x-auto">
        <button onClick={() => setActiveTab('chats')} className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'chats' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>Moderasi Chat</button>
        <button onClick={() => setActiveTab('gallery')} className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'gallery' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>Moderasi Galeri</button>
        <button onClick={() => setActiveTab('structure')} className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'structure' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>Struktur Kelas</button>
        <button onClick={() => setActiveTab('mapel')} className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'mapel' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>Jadwal Pelajaran</button>
        <button onClick={() => setActiveTab('piket')} className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'piket' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>Jadwal Piket</button>
      </div>

      <div className="bg-[#1e1e24] p-6 rounded-lg border border-gray-700 shadow-xl min-h-[400px]">
        {activeTab === 'chats' && <ChatModeration />}
        {activeTab === 'gallery' && <GalleryModeration />}
        {activeTab === 'structure' && <StructureModeration />}
        {activeTab === 'mapel' && <ScheduleModeration />}
        {activeTab === 'piket' && <PiketModeration />}
      </div>
    </div>
  );
};

export default Dashboard;
