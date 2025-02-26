document.addEventListener('DOMContentLoaded', () => {
    const seatGrid = document.getElementById('seatGrid');
    const passengerItems = document.getElementById('passengerItems');
    const passengerModal = new bootstrap.Modal(document.getElementById('passengerModal'));
    const editPassengerModal = new bootstrap.Modal(document.getElementById('editPassengerModal'));
    let passengers = [];

    // مصفوفة تحدد ترتيب المقاعد يدويًا (5 أعمدة × 13 صفًا = 65 عنصرًا)
    const seatLayout = [
        // الصف 1
        { number: '4', status: 'available' },  { number: '3', status: 'available' },  { number: '', status: 'aisle' }, { number: '2', status: 'available' },  { number: '1', status: 'available' },
        // الصف 2
        { number: '8', status: 'available' },  { number: '7', status: 'available' },  { number: '', status: 'aisle' }, { number: '6', status: 'available' },  { number: '5', status: 'available' },
        // الصف 3
        { number: '12', status: 'available' },  { number: '11', status: 'available' }, { number: '', status: 'aisle' }, { number: '10', status: 'available' }, { number: '9', status: 'available' },
        // الصف 4 (مع مدخل على الجهة اليسرى)
        { number: '16', status: 'available' },   { number: '15', status: 'available' },   { number: '', status: 'aisle' }, { number: '14', status: 'available' }, { number: '13', status: 'available' },
        // الصف 5
        { number: '20', status: 'available' }, { number: '19', status: 'available' }, { number: '', status: 'aisle' }, { number: '18', status: 'available' }, { number: '17', status: 'available' },
        // الصف 6
        { number: '24', status: 'available' }, { number: '23', status: 'available' }, { number: '', status: 'aisle' }, { number: '22', status: 'available' }, { number: '21', status: 'available' },
        // الصف 7
        { number: '', status: 'entrance' }, { number: '', status: 'entrance' }, { number: '', status: 'aisle' }, { number: '26', status: 'available' }, { number: '25', status: 'available' },
        // الصف 8
        { number: '', status: 'entrance' }, { number: '', status: 'entrance' }, { number: '', status: 'aisle' }, { number: '28', status: 'available' }, { number: '27', status: 'available' },
        // الصف 9
        { number: '32', status: 'available' }, { number: '31', status: 'available' }, { number: '', status: 'aisle' }, { number: '30', status: 'available' }, { number: '29', status: 'available' },
        // الصف 10
        { number: '36', status: 'available' }, { number: '35', status: 'available' }, { number: '', status: 'aisle' }, { number: '34', status: 'available' }, { number: '33', status: 'available' },
        // الصف 11
        { number: '40', status: 'available' }, { number: '39', status: 'available' }, { number: '', status: 'aisle' }, { number: '38', status: 'available' }, { number: '37', status: 'available' },
        // الصف 12
        { number: '44', status: 'available' }, { number: '43', status: 'available' }, { number: '', status: 'aisle' }, { number: '42', status: 'available' }, { number: '41', status: 'available' },
        // الصف 13 (مع المقعد المتصل في النهاية)
        { number: '49', status: 'available' }, { number: '48', status: 'available' }, { number: '47', status: 'available' }, { number: '46', status: 'connecting-seat' }, { number: '45', status: 'available' }
    ];

    // إنشاء المقاعد بناءً على المصفوفة
    seatLayout.forEach(seatData => {
        const seat = document.createElement('div');
        seat.classList.add('seat');

        // تعيين الحالة والرقم بناءً على البيانات
        if (seatData.status === 'aisle') {
            seat.classList.add('aisle');
            seat.textContent = '';
        } else if (seatData.status === 'entrance') {
            seat.classList.add('entrance');
            seat.textContent = 'مدخل';
        } else if (seatData.status === 'connecting-seat') {
            seat.classList.add('connecting-seat');
            seat.textContent = seatData.number;
        } else if (seatData.status === 'available') {
            seat.classList.add('available');
            seat.textContent = seatData.number;
        } else if (seatData.status === 'unavailable') {
            seat.classList.add('unavailable');
            seat.textContent = '';
        }

        // إضافة حدث النقر
        seat.addEventListener('click', () => {
            if (seat.classList.contains('available') || seat.classList.contains('connecting-seat')) {
                document.getElementById('seatNumber').value = seat.textContent;
                passengerModal.show();
            } else if (seat.classList.contains('booked')) {
                const passenger = passengers.find(p => p.seat === seat.dataset.seat);
                if (passenger) {
                    alert(`اسم الراكب: ${passenger.name} | من: ${passenger.from} | إلى: ${passenger.to}`);
                }
            } else if (seat.classList.contains('aisle')) {
                alert('هذا المكان هو ممر، غير متاح للحجز');
            } else if (seat.classList.contains('entrance')) {
                alert('هذا المكان هو مدخل الباص، غير متاح للحجز');
            }
        });

        seatGrid.appendChild(seat);
    });

    // حفظ اسم الراكب مع المدن وعرضه على المقعد
    document.getElementById('savePassenger').addEventListener('click', () => {
        const name = document.getElementById('passengerName').value;
        const from = document.getElementById('passengerFrom').value;
        const to = document.getElementById('passengerTo').value;
        const seat = document.getElementById('seatNumber').value;
        if (name && from && to && seat) {
            const seatElement = Array.from(seatGrid.children).find(s => s.textContent === seat || s.dataset.seat === seat);
            if (seatElement) {
                seatElement.classList.remove('available', 'connecting-seat');
                seatElement.classList.add('booked');
                seatElement.textContent = name; // عرض الاسم على المقعد
                seatElement.dataset.seat = seat; // حفظ رقم المقعد في dataset
                passengers.push({ seat, name, from, to });
                updatePassengerList();
                passengerModal.hide();
                document.getElementById('passengerName').value = '';
                document.getElementById('passengerFrom').selectedIndex = 0;
                document.getElementById('passengerTo').selectedIndex = 0;
            }
        }
    });

    // تحديث قائمة الركاب
    function updatePassengerList() {
        passengerItems.innerHTML = '';
        passengers.forEach((passenger, index) => {
            const li = document.createElement('li');
            li.className = 'passenger-item';
            li.innerHTML = `
                <div class="passenger-details">
                    <span>مقعد ${passenger.seat}: ${passenger.name}</span>
                    <br>
                    <small>من: ${passenger.from} | إلى: ${passenger.to}</small>
                </div>
                <div>
                    <button class="btn btn-sm btn-primary" onclick="editPassenger(${index})"><i class="fas fa-edit"></i> تعديل</button>
                    <button class="btn btn-sm btn-danger" onclick="deletePassenger(${index})"><i class="fas fa-trash"></i> حذف</button>
                </div>
            `;
            passengerItems.appendChild(li);
        });
    }

    // تعديل اسم الراكب والمدن
    window.editPassenger = function(index) {
        const passenger = passengers[index];
        document.getElementById('editPassengerName').value = passenger.name;
        document.getElementById('editPassengerFrom').value = passenger.from;
        document.getElementById('editPassengerTo').value = passenger.to;
        document.getElementById('editSeatNumber').value = passenger.seat;
        editPassengerModal.show();
    };

    // حفظ التعديل وعرض الاسم الجديد على المقعد
    document.getElementById('updatePassenger').addEventListener('click', () => {
        const name = document.getElementById('editPassengerName').value;
        const from = document.getElementById('editPassengerFrom').value;
        const to = document.getElementById('editPassengerTo').value;
        const seat = document.getElementById('editSeatNumber').value;
        if (name && from && to && seat) {
            const index = passengers.findIndex(p => p.seat === seat);
            if (index !== -1) {
                passengers[index] = { seat, name, from, to };
                const seatElement = Array.from(seatGrid.children).find(s => s.dataset.seat === seat);
                if (seatElement) {
                    seatElement.textContent = name; // تحديث الاسم على المقعد
                }
                updatePassengerList();
                editPassengerModal.hide();
            }
        }
    });

    // حذف راكب وإعادة رقم المقعد
    window.deletePassenger = function(index) {
        const passenger = passengers[index];
        const seatElement = Array.from(seatGrid.children).find(s => s.dataset.seat === passenger.seat);
        if (seatElement) {
            seatElement.classList.remove('booked');
            seatElement.classList.add('available');
            seatElement.textContent = passenger.seat; // إعادة رقم المقعد
            delete seatElement.dataset.seat; // حذف البيانات المخزنة
        }
        passengers.splice(index, 1);
        updatePassengerList();
    };
});