<div class="col-md-4 col-sm-6 col-xs-12">
    <div class="form-group required">
        <label for="filter_code">
            <g:message code="default.code.label" default="Code" />
        </label>
        <g:textField class="form-control" name="filter_code" value="\${filter?.code}"/>
    </div>
</div>
<div class="col-md-4 col-sm-6 col-xs-12">
    <div class="form-group">
        <label for="filter_fromTime">
            <g:message code="default.fromTime.label" default="From Time" />
        </label>
        <bs:dateTimePicker id="filter-fromTime" field="filter_fromTime" value="\${filter?.fromTime}"/>
    </div>
</div>
<div class="col-md-4 col-sm-6 col-xs-12">
    <div class="form-group">
        <label for="filter_toTime">
            <g:message code="default.toTime.label" default="To Time" />
        </label>
        <bs:dateTimePicker id="filter-toTime" field="filter_toTime" value="\${filter?.toTime}"/>
    </div>
</div>