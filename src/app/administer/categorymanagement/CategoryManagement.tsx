"use client";

import React, { useEffect, useState } from "react";
import { useCategoryListQuery } from "@/hooks/useCategoryList";
import SortableItem from "./SortableItem";
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    DragOverlay,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

interface Category {
    categoryId: number;
    name: string;
}

const CategoryManagement: React.FC = () => {
    const { data: categoryData, isLoading, isError, refetch } = useCategoryListQuery();
    const [isInitialRender, setIsInitialRender] = useState(true); // ✅ 최초 렌더링 감지 플래그
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeCategory, setActiveCategory] = useState<Category | null>(null); // ✅ 드래그 중인 아이템
    const [templateOpen, setTemplateOpen] = useState(false)
    const [helpOpen, setHelpOpen] = useState(false)


    useEffect(() => {
        if (categoryData?.result?.categories) {
            const sortedCategories = [...categoryData.result.categories].sort((a, b) => a.seq - b.seq);
            setCategories(sortedCategories);
        }
    }, [categoryData]);


    const onHelp = () => {
        //도움말 보여주기
        setHelpOpen(true)
    }

    const onTemplate = () => {

        //템플릿 보여주기
        setTemplateOpen(true)
    }

    // ✅ 드래그 시작 시 호출
    const handleDragStart = (event: any) => {
        const { active } = event;
        const category = categories.find((c) => c.categoryId === active.id);
        if (category) setActiveCategory(category);
    };

    // ✅ 드래그 종료 시 호출
    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        const isAlert = true
        if (!over || active.id === over.id) return;

        setCategories((prev) => {
            const oldIndex = prev.findIndex((item) => item.categoryId === active.id);
            const newIndex = prev.findIndex((item) => item.categoryId === over.id);
            return arrayMove(prev, oldIndex, newIndex);
        });

        setActiveCategory(null);
        updateCategoryOrder(isAlert);
    };

    useEffect(() => {
        if (isInitialRender) {
            setIsInitialRender(false);
            return; // ✅ 첫 번째 렌더링에서는 실행 안 함
        }

        const isAlert = false
        if (categories.length) {
            updateCategoryOrder(isAlert);
        }
    }, [categories]);



    // ✅ 카테고리 추가 함수
    const handleAddCategory = async () => {
        const newName = prompt("새로운 카테고리 이름을 입력하세요:");
        if (!newName) {
            alert("카테고리 이름을 입력해주세요.");
            return;
        }

        const newSeq = categories.length + 1;

        try {
            const accessToken = sessionStorage.getItem("accessToken");

            const response = await fetch(
                "http://172.16.211.53:8080/api/admin/categories",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ name: newName, seq: newSeq }),
                }
            );

            if (!response.ok) {
                throw new Error("카테고리 생성 실패");
            }

            alert("새로운 카테고리가 추가되었습니다.");
            refetch();
        } catch (error) {
            console.error("❌ 카테고리 추가 오류:", error);
            alert("카테고리를 추가하는 중 오류가 발생했습니다.");
        }
    };


    const updateCategoryOrder = async (isAlert: boolean) => {
        if (!categories.length) return; // 카테고리가 없으면 실행하지 않음

        const updatedCategories = categories.map((category, index) => ({
            categoryId: category.categoryId, // 기존 ID 유지
            seq: index + 1, // 항상 1부터 시작하는 seq 값 적용
        }));

        try {
            const accessToken = sessionStorage.getItem("accessToken");

            const response = await fetch("http://172.16.211.53:8080/api/admin/categories", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(updatedCategories), // 변환된 데이터 전송
            });

            if (!response.ok) {
                throw new Error("카테고리 순서 업데이트 실패");
            }

            if (isAlert) {
                alert("카테고리 순서가 업데이트되었습니다.");
            }

        } catch (error) {
            console.error("❌ 카테고리 순서 업데이트 오류:", error);
            alert("카테고리 순서를 업데이트하는 중 오류가 발생했습니다.");
        }
    };



    // ✅ DND 관련 설정
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    return (
        <div className="bg-gray-100 py-10 px-6">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">카테고리 관리</h1>

                {isLoading ? (
                    <p>🔄 로딩 중...</p>
                ) : isError ? (
                    <p>❌ 오류 발생</p>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart} // ✅ 드래그 시작 시 실행
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext items={categories.map((c) => c.categoryId)}>
                            <ul className="space-y-4">
                                {categories.map((category) => (
                                    <SortableItem
                                        key={category.categoryId}
                                        categoryId={category.categoryId}
                                        name={category.name}
                                        refetch={refetch}
                                        onHelp={onHelp}
                                        onTemplate={onTemplate}
                                    />
                                ))}
                            </ul>
                        </SortableContext>

                        {/* ✅ DragOverlay 추가 → 드래그 중 UI 유지 */}
                        <DragOverlay>
                            {activeCategory ? (
                                <div
                                    className="bg-gray-50 border border-gray-200 rounded-md shadow-lg px-4 py-7 flex items-center space-x-4"
                                    style={{
                                        opacity: 1,
                                        width: "100%", // ✅ 원본 아이템과 같은 너비
                                        height: "50px", // ✅ 리스트 아이템과 동일한 높이 유지
                                        display: "flex",
                                        alignItems: "center",
                                        // justifyContent: "space-between",
                                    }}
                                >
                                    <img src="/hamburg.png" alt="drag" className="w-5" />
                                    <span className="text-lg font-semibold text-gray-700">
                                        {activeCategory.name}
                                    </span>
                                </div>
                            ) : null}
                        </DragOverlay>


                    </DndContext>
                )}

                <button
                    className="w-full mt-6 px-6 py-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all"
                    onClick={handleAddCategory}
                >
                    카테고리 추가
                </button>
            </div>
        </div>
    );
};

export default CategoryManagement;
