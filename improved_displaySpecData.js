function displaySpecData(data) {
    // Remove debugger in production
    // debugger;
    
    // Fix: Get values instead of clearing them (if you need the values)
    // If you want to clear them, do it separately
    var fromdate = $('#specpclevelfromdate').val();
    var todate = $('#specpcleveltodate').val();
    
    // Clear the date inputs if needed
    $('#specpclevelfromdate').val('');
    $('#specpcleveltodate').val('');
    
    $("#SpecDataGrid").empty();
    $("#savepclevelspecdata").show();
    
    // Validate input data
    if (!data || !Array.isArray(data)) {
        console.error('Invalid data provided to displaySpecData');
        return;
    }
    
    // Create unique data set - improved logic
    let uniqueData = [];
    let seenIds = new Set();
    
    data.forEach(item => {
        if (item && item.AssetParameterId && !seenIds.has(item.AssetParameterId)) {
            seenIds.add(item.AssetParameterId);
            uniqueData.push(item);
        }
    });
    
    // Helper function for consistent null/empty checking
    function safeValue(value, defaultValue = 0) {
        return (value != null && value !== '') ? value : defaultValue;
    }
    
    // Helper function for safe number conversion
    function safeNumber(value, defaultValue = 0) {
        const parsed = parseFloat(value);
        return !isNaN(parsed) ? parsed : defaultValue;
    }
    
    var dataSource = new kendo.data.DataSource({
        data: uniqueData.map(item => ({
            AssetParameterId: item.AssetParameterId,
            ProcessCapabilityID: item.ProcessCapabilityID,
            ParameterName: item.ParameterName,
            DisplayText: item.DisplayText,
            Comment: item.Comment,
            // Old values
            OldLCL: safeNumber(item.LCL),
            OldUCL: safeNumber(item.UCL),
            OldTarget: safeNumber(item.Target),
            OldTolerance: safeNumber(item.Tolerance),
            OldComment: item.Comment || '',
            // Current values (initially same as old)
            CurrentLCL: safeNumber(item.LCL),
            CurrentUCL: safeNumber(item.UCL),
            CurrentTarget: safeNumber(item.Target),
            CurrentTolerance: safeNumber(item.Tolerance),
            CurrentComment: item.Comment || ''
        })),
        schema: {
            model: {
                id: "AssetParameterId",
                fields: {
                    AssetParameterId: { type: "number" },
                    ProcessCapabilityID: { type: "number" },
                    ParameterName: { type: "string", editable: false },
                    DisplayText: { type: "string", editable: false },
                    OldLCL: { type: "number", editable: false },
                    OldUCL: { type: "number", editable: false },
                    OldTarget: { type: "number", editable: false },
                    OldTolerance: { type: "number", editable: false },
                    OldComment: { type: "string", editable: false },
                    CurrentLCL: { type: "number" },
                    CurrentUCL: { type: "number" },
                    CurrentTarget: { type: "number", nullable: true },
                    CurrentTolerance: { type: "number", nullable: true },
                    CurrentComment: { type: "string", nullable: true }
                }
            }
        }
    });
    
    $("#SpecDataGrid").kendoGrid({
        dataSource: dataSource,
        scrollable: false,
        rowTemplate: kendo.template(
            `<tr data-processcapabilityid='#= ProcessCapabilityID #'
                data-parametername='#= ParameterName #'
                data-id='#= AssetParameterId #'
                data-oldlcl='#= OldLCL #'
                data-olducl='#= OldUCL #'
                data-oldtarget='#= OldTarget #'
                data-oldtolerance='#= OldTolerance #'
                data-oldcomment='#= OldComment #'>
                <td>#: ParameterName #</td>
                <td>#: DisplayText #</td>
                <td>#: kendo.toString(OldLCL, 'n2') #</td>
                <td>#: kendo.toString(OldUCL, 'n2') #</td>
                <td>#: kendo.toString(OldTarget, 'n2') #</td>
                <td>#: kendo.toString(OldTolerance, 'n2') #</td>
                <td>
                    <input type="number" class="lcl-input k-textbox current-input readonly-input center-text"
                           value="#= kendo.toString(CurrentLCL, 'n2') #" readonly style="width: 60px;" step="0.01">
                </td>
                <td>
                    <input type="number" class="ucl-input k-textbox current-input readonly-input center-text"
                           value="#= kendo.toString(CurrentUCL, 'n2') #" readonly style="width: 60px;" step="0.01">
                </td>
                <td>
                    <input type="number" class="target-input k-textbox current-input center-text"
                           value="#= kendo.toString(CurrentTarget, 'n2') #" style="width: 80px;" step="0.01">
                </td>
                <td>
                    <input type="number" class="tolerance-input k-textbox current-input center-text"
                           value="#= kendo.toString(CurrentTolerance, 'n2') #" style="width: 80px;" step="0.01">
                </td>
                <td>
                    <input type="text" class="comment-input k-textbox current-input"
                           value="#= CurrentComment #" style="width: 120px;">
                </td>
            </tr>`
        ),
        columns: [
            { field: "ParameterName", title: "Parameter Name", width: "150px" },
            { field: "DisplayText", title: "Display Text", width: "150px" },
            {
                title: "Old",
                columns: [
                    { field: "OldLCL", title: "LCL", width: "80px", template: "#= kendo.toString(OldLCL, 'n2') #" },
                    { field: "OldUCL", title: "UCL", width: "80px", template: "#= kendo.toString(OldUCL, 'n2') #" },
                    { field: "OldTarget", title: "Target", width: "80px", template: "#= kendo.toString(OldTarget, 'n2') #" },
                    { field: "OldTolerance", title: "Tolerance", width: "80px", template: "#= kendo.toString(OldTolerance, 'n2') #" }
                ]
            },
            {
                title: "Current",
                columns: [
                    { field: "CurrentLCL", title: "LCL", width: "80px", template: "#= kendo.toString(CurrentLCL, 'n2') #" },
                    { field: "CurrentUCL", title: "UCL", width: "80px", template: "#= kendo.toString(CurrentUCL, 'n2') #" },
                    { field: "CurrentTarget", title: "Target", width: "80px", template: "#= kendo.toString(CurrentTarget, 'n2') #" },
                    { field: "CurrentTolerance", title: "Tolerance", width: "80px", template: "#= kendo.toString(CurrentTolerance, 'n2') #" },
                    { field: "CurrentComment", title: "Comment", width: "150px" }
                ]
            }
        ]
    });

    // Improved event handler with validation and error handling
    $("#SpecDataGrid").on("input", ".current-input", function () {
        try {
            const $input = $(this);
            const $row = $input.closest("tr");
            const AssetParameterId = $row.data("id");
            const parameterName = $row.data("parametername");
            
            // Cache jQuery selections for better performance
            const $lclInput = $row.find(".lcl-input");
            const $uclInput = $row.find(".ucl-input");
            const $targetInput = $row.find(".target-input");
            const $toleranceInput = $row.find(".tolerance-input");
            
            const lcl = safeNumber($lclInput.val());
            const ucl = safeNumber($uclInput.val());
            const target = safeNumber($targetInput.val());
            const tolerance = safeNumber($toleranceInput.val());

            const isLCLUCLChanged = $input.hasClass("lcl-input") || $input.hasClass("ucl-input");
            const isTargetToleranceChanged = $input.hasClass("target-input") || $input.hasClass("tolerance-input");

            if (isLCLUCLChanged) {
                // Calculate tolerance from LCL/UCL
                const newTolerance = Math.abs(ucl - lcl);
                $toleranceInput.val(newTolerance.toFixed(2));
                
                // Validation: LCL should be less than UCL
                if (lcl >= ucl && lcl !== 0 && ucl !== 0) {
                    console.warn(`Warning: LCL (${lcl}) should be less than UCL (${ucl}) for parameter ${parameterName}`);
                    // You could add visual feedback here
                    $input.addClass('validation-warning');
                } else {
                    $input.removeClass('validation-warning');
                }
                
            } else if (isTargetToleranceChanged) {
                // Calculate LCL/UCL from target and tolerance
                if (tolerance >= 0) {
                    const halfTolerance = tolerance / 2;
                    const newUCL = target + halfTolerance;
                    const newLCL = target - halfTolerance;

                    $lclInput.val(newLCL.toFixed(2));
                    $uclInput.val(newUCL.toFixed(2));
                } else {
                    console.warn(`Warning: Tolerance should not be negative for parameter ${parameterName}`);
                    $input.addClass('validation-warning');
                }
            }
            
            // Optional: Trigger custom event for external listeners
            $row.trigger('specDataChanged', {
                AssetParameterId: AssetParameterId,
                parameterName: parameterName,
                currentValues: {
                    lcl: safeNumber($lclInput.val()),
                    ucl: safeNumber($uclInput.val()),
                    target: safeNumber($targetInput.val()),
                    tolerance: safeNumber($toleranceInput.val()),
                    comment: $row.find(".comment-input").val()
                }
            });
            
        } catch (error) {
            console.error('Error in spec data input handler:', error);
        }
    });
}

// Optional: Add CSS for validation warnings
// .validation-warning { border-color: #ff9800 !important; background-color: #fff3e0; }