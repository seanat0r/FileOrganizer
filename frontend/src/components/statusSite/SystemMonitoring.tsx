import {useEffect, useRef, useState} from "react";
import type {Drives, SystemInfo} from '../../types';
import {getSystemInfo} from "../../api/backend.ts";
import {ByteFormatter} from "../../utils/ByteFormatter.ts";

export function SystemMonitoring() {
    const NO_DATA = "Couldn't get the data";
    const isFetching = useRef(false);
    const [systemStatus, setSystemStatus] = useState<SystemInfo>();

    useEffect(() => {
        const fetchSystemInfo = async () => {
            if (isFetching.current) return;
            isFetching.current = true;

            try {
                const getData: SystemInfo = await getSystemInfo();

                if (!getData || !getData.cpuLoad) {
                    console.warn("No Data from Backend: " + getData.cpuLoad);
                    return;
                }

                // converting driver disk from bytes to mb
                const newDriver: Drives[] = [];
                getData.drives.forEach(element => {
                    newDriver.push({
                        driveName: element.driveName,
                        inUseSpace: ByteFormatter.bytesToMB(element.inUseSpace),
                        freeSpace: ByteFormatter.bytesToMB(element.freeSpace),
                        totalSpace: ByteFormatter.bytesToMB(element.totalSpace),
                    })
                })

                const cpuPerCent = parseFloat(getData.cpuLoad.toFixed(2));

                // set the new states and formating bytes to gb.
                console.log("CPU raw: " + getData.cpuLoad);
                setSystemStatus({
                    totalRAM: ByteFormatter.bytesToGB(getData.totalRAM),
                    freeRAM: ByteFormatter.bytesToGB(getData.freeRAM),
                    usedRAM: ByteFormatter.bytesToGB(getData.usedRAM),
                    cpuLoad: cpuPerCent,
                    drives: newDriver
                });
                console.log("CPU after: " + cpuPerCent);
            } finally {
                isFetching.current = false;
            }
        };
        void fetchSystemInfo();
    }, []);

    const filterDrive = (drives: Drives[]) => {
        const MIN_SIZE_MB = 1000;
        const uniqueDrivesMap = new Map();

        drives.filter(d => d.totalSpace > MIN_SIZE_MB).forEach(d => {
            if (!uniqueDrivesMap.has(d.totalSpace)) {
                uniqueDrivesMap.set(d.totalSpace, d);
            }
        })

        return Array.from(uniqueDrivesMap.values());
    }

    function getPercent(total: number, used: number): number {
        if (total === 0) return 0;
        return Math.round((used / total) * 10000) / 100;
    }

    return (
        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-md min-w-0 w-full">
            <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-6 pb-3 border-b border-border truncate">System
                Info Monitoring</h3>

            <div className="flex flex-col xl:grid xl:grid-cols-2 gap-6 min-w-0">

                <div className="bg-bg-base border border-border rounded-lg p-5 min-w-0">
                    <h4 className="text-base font-semibold text-text-secondary mb-4 truncate">CPU Info:</h4>
                    <dl className="flex justify-between items-center mb-3 gap-3">
                        <dt className="text-base text-text-primary shrink-0">CPU-Load:</dt>
                        <dd className="text-base font-bold text-text-primary truncate">{systemStatus?.cpuLoad + " %" || NO_DATA}</dd>
                    </dl>
                    <div className="w-full bg-bg-surface rounded-full h-3 overflow-hidden border border-border">
                        <div className="bg-accent-blue h-full rounded-full transition-all duration-500"
                             style={{width: `${systemStatus?.cpuLoad || 0}%`}}></div>
                    </div>
                </div>

                <div className="bg-bg-base border border-border rounded-lg p-5 min-w-0">
                    <h4 className="text-base font-semibold text-text-secondary mb-4 truncate">RAM Info:</h4>
                    <dl className="flex justify-between items-center text-base mb-2 text-text-primary gap-3">
                        <dt className="shrink-0">Free RAM:</dt>
                        <dd className="truncate">{systemStatus?.freeRAM + " GB" || NO_DATA}</dd>
                    </dl>
                    <dl className="flex justify-between items-center text-base mb-4 text-text-primary gap-3">
                        <dt className="shrink-0">Max RAM:</dt>
                        <dd className="truncate">{systemStatus?.totalRAM + " GB" || NO_DATA}</dd>
                    </dl>
                    <div className="pt-4 border-t border-border">
                        <dl className="flex justify-between items-center text-base mb-3 gap-3">
                            <dt className="text-text-primary shrink-0">Currently Using:</dt>
                            <dd className="font-bold text-text-primary truncate">{systemStatus?.usedRAM + " GB" || NO_DATA}</dd>
                        </dl>
                        <div className="w-full bg-bg-surface rounded-full h-3 overflow-hidden border border-border">
                            <span className="block bg-accent-blue h-full rounded-full transition-all duration-500"
                                  style={{width: `${getPercent(systemStatus?.totalRAM || 0, systemStatus?.usedRAM || 0)}%`}}></span>
                        </div>
                    </div>
                </div>

                {filterDrive(systemStatus?.drives || []).map((element, index) => {
                    return (
                        <div key={index} className="bg-bg-base border border-border rounded-lg p-5 min-w-0">
                            <h4 className="text-base font-bold text-text-primary mb-4 truncate"
                                title={element.driveName || NO_DATA}>
                                {element.driveName || NO_DATA}
                            </h4>
                            <dl className="flex flex-col gap-3 text-sm sm:text-base">
                                <div className="flex justify-between items-center gap-3">
                                    <dt className="text-text-secondary shrink-0">Total space:</dt>
                                    <dd className="font-medium text-text-primary truncate">{element.totalSpace + " MB" || NO_DATA}</dd>
                                </div>
                                <div className="flex justify-between items-center gap-3">
                                    <dt className="text-text-secondary shrink-0">Free Space:</dt>
                                    <dd className="font-medium text-text-primary truncate">{element.freeSpace + " MB" || NO_DATA}</dd>
                                </div>
                                <div
                                    className="flex justify-between items-center pt-3 border-t border-border mt-2 gap-3">
                                    <dt className="text-text-primary font-semibold shrink-0">Using:</dt>
                                    <dd className="font-bold text-text-primary truncate">{element.inUseSpace + " MB" || NO_DATA}</dd>
                                </div>
                                <div
                                    className="w-full bg-bg-surface rounded-full h-3 overflow-hidden border border-border">
                                    <span
                                        className="block bg-accent-blue h-full rounded-full transition-all duration-500"
                                        style={{width: `${getPercent(element.totalSpace || 0, element.inUseSpace || 0)}%`}}></span>
                                </div>
                            </dl>
                        </div>
                    )
                })}
            </div>
        </div>
    )

}