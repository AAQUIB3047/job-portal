import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { jobApi } from "../../api/jobApi";
import JobCard from "../../components/jobs/JobCard";
import SearchFilters from "../../components/jobs/SearchFilters";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";

export default function JobListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  const filter = {
    keyword: searchParams.get("keyword") || "",
    location: searchParams.get("location") || "",
    type: searchParams.get("type") || "",
    experience: searchParams.get("experience") || "",
    page: Number(searchParams.get("page") || 0),
  };

  useEffect(() => {
    setLoading(true);
    const params = {
      keyword: filter.keyword || undefined,
      location: filter.location || undefined,
      type: filter.type || undefined,
      experience: filter.experience || undefined,
      page: filter.page,
      size: 9,
    };

    jobApi
      .searchJobs(params)
      .then((res) => {
        setJobs(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleFilterChange = (newFilter) => {
    const nextParams = new URLSearchParams();
    if (newFilter.keyword) nextParams.set("keyword", newFilter.keyword);
    if (newFilter.location) nextParams.set("location", newFilter.location);
    if (newFilter.type) nextParams.set("type", newFilter.type);
    if (newFilter.experience) nextParams.set("experience", newFilter.experience);
    nextParams.set("page", "0");
    setSearchParams(nextParams);
  };

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", newPage.toString());
    setSearchParams(nextParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Explore Open Job Opportunities</h1>
          <p className="text-xs text-slate-500 font-medium">
            Found <strong className="text-indigo-600 font-bold">{totalElements}</strong> matching jobs
          </p>
        </div>
      </div>

      <SearchFilters filter={filter} onChange={handleFilterChange} onReset={handleReset} />

      {loading ? (
        <Loader text="Searching open positions..." />
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <p className="text-base font-bold text-slate-700">No jobs match your search criteria.</p>
          <p className="text-xs text-slate-500">Try adjusting your keyword, location or job type filters.</p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          <Pagination page={filter.page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}
