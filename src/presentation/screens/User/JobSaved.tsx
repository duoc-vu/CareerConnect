import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import firestore from "@react-native-firebase/firestore";
import JobCard from "../../components/JobCard";
import { useUser } from "../../../context/UserContext";
import Loading from "../../components/Loading";
import { theme } from "../../../theme/theme";
import { Fonts } from "../../../theme/font";
import SearchBar from "../../components/SearchBar";
import { Image } from "react-native-animatable";

const JobSaved = ({ navigation }: any) => {
    const { userId, userInfo } = useUser();
    const [savedJobs, setSavedJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSavedJobs, setFilteredSavedJobs] = useState<any[]>([]);


    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                setLoading(true);

                const candidateSnapshot = await firestore()
                    .collection("tblUngVien")
                    .where("sMaUngVien", "==", userId)
                    .get();

                if (!candidateSnapshot.empty) {
                    const candidateData = candidateSnapshot.docs[0].data();
                    const savedJobIds = candidateData.sCongViecDaLuu || [];

                    const jobPromises = savedJobIds.map(async (jobId: string) => {
                        const jobSnapshot = await firestore()
                            .collection("tblTinTuyenDung")
                            .where("sMaTinTuyenDung", "==", jobId)
                            .get();

                        if (!jobSnapshot.empty) {
                            const jobData = jobSnapshot.docs[0].data();

                            let companyName = "Unknown Company";
                            let companyLogo = "";
                            if (jobData.sMaDoanhNghiep) {
                                const companySnapshot = await firestore()
                                    .collection("tblDoanhNghiep")
                                    .where("sMaDoanhNghiep", "==", jobData.sMaDoanhNghiep)
                                    .get();

                                if (!companySnapshot.empty) {
                                    const companyData = companySnapshot.docs[0].data();
                                    companyName = companyData.sTenDoanhNghiep || "Unknown Company";
                                    companyLogo = companyData.sAnhDaiDien || "";
                                }
                            }

                            return {
                                sMaTinTuyenDung: jobData.sMaTinTuyenDung,
                                sViTriTuyenDung: jobData.sViTriTuyenDung,
                                sTenDoanhNghiep: companyName,
                                sAnhDaiDien: companyLogo,
                                sMucLuongToiThieu: jobData.sMucLuongToiThieu,
                                sMucLuongToiDa: jobData.sMucLuongToiDa,
                                sDiaChiLamViec: jobData.sDiaChiLamViec || "Remote",
                                sTrangThai: jobData.sTrangThai,
                            };
                        }
                        return null;
                    });

                    const jobs = await Promise.all(jobPromises);
                    const filteredJobs = jobs.filter((job) => job !== null);
                    setSavedJobs(filteredJobs);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách công việc đã lưu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedJobs();
    }, [userId]);

    useEffect(() => {
        setFilteredSavedJobs(savedJobs);
    }, [savedJobs]);

    const filterJobs = (query: string) => {
        if (!query.trim()) {
            setFilteredSavedJobs(savedJobs);
            return;
        }

        const filtered = savedJobs.filter((job: any) =>
            job.sViTriTuyenDung.toLowerCase().includes(query.toLowerCase()) ||
            job.sTenDoanhNghiep.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredSavedJobs(filtered);
    };

    const renderJobCard = ({ item }: any) => (
        <JobCard
            companyLogo={item.sAnhDaiDien}
            companyName={item.sTenDoanhNghiep}
            jobTitle={item.sViTriTuyenDung}
            salaryMax={item.sMucLuongToiDa || 0}
            jobType="On-site"
            location={item.sDiaChiLamViec}
            onPress={() => navigation.navigate("job-detail", { sMaTinTuyenDung: item.sMaTinTuyenDung })}
            style={styles.verticalJobCard}
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <SearchBar
                    style={styles.searchBar}
                    value={searchQuery}
                    onChangeText={(query: any) => {
                        setSearchQuery(query);
                        filterJobs(query);
                    }} />
                <Image
                    source={userInfo?.sAnhDaiDien ? { uri: userInfo?.sAnhDaiDien } : require('../../../../asset/images/img_ellipse_3.png')}
                    style={styles.avatar}
                />
            </View>
            <Text style={styles.sectionTitle}>Công việc đã lưu</Text>

            {loading ? (
                <Loading />
            ) : filteredSavedJobs.length > 0 ? (
                <FlatList
                    data={filteredSavedJobs}
                    renderItem={renderJobCard}
                    keyExtractor={(item) => item.sMaTinTuyenDung}
                    contentContainerStyle={styles.verticalList}
                />
            ) : (
                <Text style={styles.noJobsText}>Không có công việc nào được lưu.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        marginBottom: 70,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '95%',
        marginHorizontal: 20,
        marginTop: 10
    },
    searchBar: {
        width: '80%',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 10,
    },
    horizontalList: {
        paddingHorizontal: 10,
    },
    horizontalGroup: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginHorizontal: 5,
    },
    sectionTitle: {
        fontFamily: Fonts.medium.fontFamily,
        fontSize: 18,
        color: theme.colors.titleJob.third,
        marginVertical: 10,
        marginLeft: 10,
    },
    verticalList: {
        paddingHorizontal: 10,
    },
    verticalJobCard: {
        marginVertical: 10,
    },
    noJobsText: {
        textAlign: 'center',
        fontSize: 14,
        color: theme.colors.titleJob.primary,
        marginTop: 10,
    },
});

export default JobSaved;