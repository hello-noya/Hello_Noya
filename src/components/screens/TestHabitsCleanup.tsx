import React from 'react';
import { useApp } from '../../context/AppContext';

export function TestHabitsCleanup() {
  const { state, updateHabit } = useApp();

  const testCleanup = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayISO = yesterday.toISOString().split('T')[0];
    const todayISO = today.toISOString().split('T')[0];

    console.log('=== Тест очистки завершенных привычек ===');
    console.log('Сегодня:', todayISO);
    console.log('Вчера:', yesterdayISO);
    console.log('\nПривычки до очистки:');
    
    state.habits.forEach(habit => {
      console.log(`- ${habit.name}: ${habit.completedDates.length} завершений`);
      if (habit.completedDates.length > 0) {
        console.log(`  Даты: ${habit.completedDates.join(', ')}`);
      }
    });

    // Добавляем тестовое завершение на вчера
    if (state.habits.length > 0) {
      const testHabit = state.habits[0];
      const updatedHabit = {
        ...testHabit,
        completedDates: [...testHabit.completedDates, yesterdayISO]
      };
      updateHabit(updatedHabit);
      console.log(`\nДобавлено тестовое завершение для "${testHabit.name}" на ${yesterdayISO}`);
    }

    // Имитируем очистку (как в useEffect)
    setTimeout(() => {
      console.log('\nЗапуск очистки...');
      state.habits.forEach(habit => {
        const oldDates = habit.completedDates.filter(date => date < todayISO);
        if (oldDates.length > 0) {
          const newDates = habit.completedDates.filter(date => date >= todayISO);
          updateHabit({ ...habit, completedDates: newDates });
          console.log(`Очищено ${oldDates.length} старых завершений для "${habit.name}"`);
        }
      });

      console.log('\nПривычки после очистки:');
      state.habits.forEach(habit => {
        console.log(`- ${habit.name}: ${habit.completedDates.length} завершений`);
        if (habit.completedDates.length > 0) {
          console.log(`  Даты: ${habit.completedDates.join(', ')}`);
        }
      });
      console.log('=== Тест завершен ===');
    }, 100);
  };

  return (
    <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30">
      <h3 className="text-sm font-semibold text-yellow-600 mb-2">🧪 Тестовая функция</h3>
      <p className="text-xs text-[var(--text-muted)] mb-3">
        Проверка очистки завершенных привычек
      </p>
      <button
        onClick={testCleanup}
        className="px-4 py-2 rounded-lg bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition-colors"
      >
        Запустить тест
      </button>
      <p className="text-xs text-[var(--text-muted)] mt-2">
        Результат в консоли браузера (F12)
      </p>
    </div>
  );
}
