"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        router.push("/account/login");
        return;
      }

      setUserId(user.id);
      setEmail(user.email);

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        setUsername(data.username || "");
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
        setApartment(data.apartment || "");
        setCity(data.city || "");
        setStateValue(data.state || "");
        setZipCode(data.zip_code || "");
      }

      setLoading(false);
    }

    loadProfile();
  }, [router]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      email,
      username: username.trim().toLowerCase(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      apartment: apartment.trim(),
      city: city.trim(),
      state: stateValue.trim(),
      zip_code: zipCode.trim(),
    });

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setMessage("Profile saved successfully.");
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#081526] px-6 py-28 text-white">
        <p className="text-center text-white/60">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#081526] px-6 py-28 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/account"
          className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-blue-300 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Account
        </Link>

        <section className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur md:p-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-blue-300">
            Account Profile
          </p>

          <h1 className="mb-4 text-5xl font-black tracking-tight">
            Profile Settings
          </h1>

          <p className="mb-8 text-white/60">
            Save your account details and shipping information for faster checkout.
          </p>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm text-white/60">Email</label>
              <input className="profile-input opacity-60" value={email} readOnly />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">Username</label>
              <input
                className="profile-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-white/60">First name</label>
                <input
                  className="profile-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/60">Last name</label>
                <input
                  className="profile-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">Phone</label>
              <input
                className="profile-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">Address</label>
              <input
                className="profile-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address"
              />
            </div>

            <input
              className="profile-input"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
              placeholder="Apartment, suite, etc."
            />

            <div className="grid gap-4 md:grid-cols-3">
              <input
                className="profile-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />

              <input
                className="profile-input"
                value={stateValue}
                onChange={(e) => setStateValue(e.target.value.toUpperCase())}
                placeholder="State"
                maxLength={2}
              />

              <input
                className="profile-input"
                value={zipCode}
                onChange={(e) =>
                  setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))
                }
                placeholder="ZIP code"
              />
            </div>

            {message && (
              <p className="rounded-2xl border border-blue-400/30 bg-blue-500/10 px-5 py-4 text-sm text-blue-100">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-white hover:bg-blue-400 disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </section>
      </div>

      <style jsx>{`
        .profile-input {
          width: 100%;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          padding: 1rem 1.25rem;
          color: white;
          outline: none;
        }

        .profile-input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .profile-input:focus {
          border-color: rgba(96, 165, 250, 0.55);
        }
      `}</style>
    </main>
  );
}