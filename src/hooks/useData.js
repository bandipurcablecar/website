import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSettings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .single();

            if (error) throw error;
            setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    }

    return { settings, loading, refetch: fetchSettings };
}

export function useProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    }

    return { projects, loading, refetch: fetchProjects };
}

export function useAssociateCompanies() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompanies();
    }, []);

    async function fetchCompanies() {
        try {
            const { data, error } = await supabase
                .from('associate_companies')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (error) throw error;
            setCompanies(data || []);
        } catch (error) {
            console.error('Error fetching companies:', error);
        } finally {
            setLoading(false);
        }
    }

    return { companies, loading, refetch: fetchCompanies };
}

export function useSupporters() {
    const [supporters, setSupporters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSupporters();
    }, []);

    async function fetchSupporters() {
        try {
            const { data, error } = await supabase
                .from('supporters')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (error) throw error;
            setSupporters(data || []);
        } catch (error) {
            console.error('Error fetching supporters:', error);
        } finally {
            setLoading(false);
        }
    }

    return { supporters, loading, refetch: fetchSupporters };
}

export function useAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    async function fetchAnnouncements() {
        try {
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .eq('is_active', true)
                .order('published_at', { ascending: false });

            if (error) throw error;
            setAnnouncements(data || []);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    }

    return { announcements, loading, refetch: fetchAnnouncements };
}

export function useAttractions() {
    const [attractions, setAttractions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAttractions();
    }, []);

    async function fetchAttractions() {
        try {
            const { data, error } = await supabase
                .from('bandipur_attractions')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (error) throw error;
            setAttractions(data || []);
        } catch (error) {
            console.error('Error fetching attractions:', error);
        } finally {
            setLoading(false);
        }
    }

    return { attractions, loading, refetch: fetchAttractions };
}

export function useTeamMembers() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMembers();
    }, []);

    async function fetchMembers() {
        try {
            const { data, error } = await supabase
                .from('team_members')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setMembers(data || []);
        } catch (error) {
            console.error('Error fetching team members:', error);
        } finally {
            setLoading(false);
        }
    }

    return { members, loading, refetch: fetchMembers };
}

export function useProjectProgress() {
    const [milestones, setMilestones] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProgress();
    }, []);

    async function fetchProgress() {
        try {
            const [milestonesRes, statusRes] = await Promise.all([
                supabase.from('project_milestones').select('*').order('display_order', { ascending: true }),
                supabase.from('project_status').select('*')
            ]);

            if (milestonesRes.error) throw milestonesRes.error;
            if (statusRes.error) throw statusRes.error;

            setMilestones(milestonesRes.data || []);
            setStatusData(statusRes.data || []);
        } catch (error) {
            console.error('Error fetching progress:', error);
        } finally {
            setLoading(false);
        }
    }

    return { milestones, statusData, loading, refetch: fetchProgress };
}
