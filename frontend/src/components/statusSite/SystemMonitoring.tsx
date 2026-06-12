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
                console.log("--- Fetching SystemInfo... ---");
                const getData: SystemInfo = await getSystemInfo();
                console.log(" Data from Backend: " + getData);

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

    function getRAMusageInPercent(total: number, used: number): number {
        // calculates the %-Of RAM usage. Shifting the Value by 100 to get 2 decimal
        return Math.round(((total / 100) * used) * 100) / 100;
    }

    return (
        <div>
            <h3>System Info Monitoring</h3>
            <div>
                <div>
                    <h4>CPU Info:</h4>
                    <dl>
                        <dt>CPU-Load:</dt>
                        <dd>{systemStatus?.cpuLoad + " %" || NO_DATA}</dd>
                    </dl>
                </div>
                <div>
                    <h4>RAM Info:</h4>
                    <dl>
                        <dt>Free RAM:</dt>
                        <dd>{systemStatus?.freeRAM + " GB" || NO_DATA}</dd>

                        <dt>Max RAM:</dt>
                        <dd>{systemStatus?.totalRAM + " GB" || NO_DATA}</dd>
                    </dl>
                    <div>
                        <dl>
                            <dt>Currently Using:</dt>
                            <dd>{systemStatus?.usedRAM + " GB" || NO_DATA}</dd>
                        </dl>
                        <span
                            style={{width: `${getRAMusageInPercent(systemStatus?.totalRAM || 0, systemStatus?.usedRAM || 0)}`}}></span>
                    </div>
                </div>
                {filterDrive(systemStatus?.drives || []).map((element, index) => {
                    return (
                        <div key={index}>
                            <h4>{element.driveName || NO_DATA}</h4>
                            <dl>
                                <dt>Total space:</dt>
                                <dd>{element.totalSpace + " MB" || NO_DATA}</dd>

                                <dt>Free Space:</dt>
                                <dd>{element.freeSpace + " MB" || NO_DATA}</dd>

                                <dt>Using:</dt>
                                <dd>{element.inUseSpace + " MB" || NO_DATA}</dd>
                            </dl>
                        </div>
                    )
                })
                }
            </div>
        </div>
    )

}