package org.mskcc.cbio.annotator;

import org.apache.commons.exec.CommandLine;
import org.apache.commons.exec.DefaultExecuteResultHandler;
import org.apache.commons.exec.DefaultExecutor;
import org.apache.commons.exec.Executor;
import org.mskcc.cbio.maf.*;

import java.io.*;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * Main class for adding generic annotations.
 * This class depends on some external (non-Java) scripts.
 *
 * @author Selcuk Onur Sumer
 */
public class Annotator
{
	private AnnotatorConfig config;

	public Annotator(AnnotatorConfig config)
	{
		// init default settings
		this.config = config;
	}

	public void annotateFile(File input,
			File output) throws IOException
	{
		int retVal = -1;

		// script to run depends on the extension
		if (input.getName().toLowerCase().endsWith(".vcf"))
		{
			retVal = this.runVcf2Maf(input, output);
			return;
		}
		// assuming it is a maf..
		else
		{
			retVal = this.runMaf2Maf(input);
		}

		// TODO check return value?
		if (retVal != 0)
		{
			return;
		}

		List<String> annoHeaders = this.extractAnnoHeaders(this.config.getIntermediateMaf());

		FileReader reader = new FileReader(input);
		//FileReader reader = new FileReader(DEFAULT_INTERMEDIATE_MAF);

		BufferedReader bufReader = new BufferedReader(reader);
		MafHeaderUtil headerUtil = new MafHeaderUtil();

		String headerLine = headerUtil.extractHeader(bufReader);
		MafUtil mafUtil = new MafUtil(headerLine);

		AnnoMafProcessor processor = new AnnoMafProcessor(headerLine, annoHeaders);

		FileWriter writer = new FileWriter(output);

		// write comments/metadata to the output
		FileIOUtil.writeLines(writer, headerUtil.getComments());

		// create new header line for output
		List<String> columnNames = processor.newHeaderList(
				this.config.isSort(), this.config.isAddMissing());

		// write the header line to output
		FileIOUtil.writeLine(writer, columnNames);

		String dataLine = bufReader.readLine();
		AnnotatorService service = new AnnotatorService(this.config);

		// process the file line by line
		while (dataLine != null)
		{
			// skip empty lines
			if (dataLine.trim().length() == 0)
			{
				dataLine = bufReader.readLine();
				continue;
			}

			// update total number of records processed
			//this.numRecordsProcessed++;

			MafRecord mafRecord = mafUtil.parseRecord(dataLine);
			Map<String, String> annoData = service.annotateRecord(mafRecord);

			// get the data and update/add new annotator columns
			List<String> data = processor.newDataList(dataLine);

			processor.updateAnnoData(data, annoData);

			// write data to the output file
			FileIOUtil.writeLine(writer, data);

			dataLine = bufReader.readLine();
		}

		bufReader.close();
		writer.close();

	}

	public int runMaf2Maf(File input) throws IOException
	{
		String inputMaf = input.getAbsolutePath();

		CommandLine cmdLine = new CommandLine("perl");

		cmdLine.addArgument(this.config.getMaf2maf());
		cmdLine.addArgument("--vep-path");
		cmdLine.addArgument(this.config.getVepPath());
		cmdLine.addArgument("--vep-data");
		cmdLine.addArgument(this.config.getVepData());
		cmdLine.addArgument("--ref-fasta");
		cmdLine.addArgument(this.config.getRefFasta());
		cmdLine.addArgument("--input-maf");
		cmdLine.addArgument(inputMaf);
		//cmdLine.addArgument("--output-dir");
		//cmdLine.addArgument(this.config.getIntermediateDir());
		cmdLine.addArgument("--output-maf");
		cmdLine.addArgument(this.config.getIntermediateMaf());

		return execProcess(cmdLine);
	}

	public int runVcf2Maf(File input, File output) throws IOException
	{
		String inVcf = input.getAbsolutePath();
		String outMaf = output.getAbsolutePath();

		CommandLine cmdLine = new CommandLine("perl");

		cmdLine.addArgument(this.config.getVcf2maf());
		cmdLine.addArgument("--vep-path");
		cmdLine.addArgument(this.config.getVepPath());
		cmdLine.addArgument("--vep-data");
		cmdLine.addArgument(this.config.getVepData());
		cmdLine.addArgument("--ref-fasta");
		cmdLine.addArgument(this.config.getRefFasta());
		cmdLine.addArgument("--input-vcf");
		cmdLine.addArgument(inVcf);
		cmdLine.addArgument("--output-maf");
		cmdLine.addArgument(outMaf);

		return execProcess(cmdLine);
	}

	/**
	 * Executes an external process via system call.
	 *
	 * @param cmdLine   process arguments (including the process itself)
	 * @return          exit value of the process
	 * @throws IOException  if an IO error occurs
	 */
	public static int execProcess(CommandLine cmdLine) throws IOException
	{
		DefaultExecuteResultHandler resultHandler = new DefaultExecuteResultHandler();

		//ExecuteWatchdog watchdog = new ExecuteWatchdog(60*1000);
		Executor executor = new DefaultExecutor();
		//executor.setExitValue(1);
		//executor.setWatchdog(watchdog);
		executor.execute(cmdLine, resultHandler);

		// wait for process to complete
		try
		{
			resultHandler.waitFor();
		}
		catch (InterruptedException e)
		{
			e.printStackTrace();
		}

		return resultHandler.getExitValue();
	}

	protected void outputFileNames(File input, File output)
	{
		System.out.println("Reading input from: " + input.getAbsolutePath());
		System.out.println("Writing output to: " + output.getAbsolutePath());
	}

	protected List<String> extractAnnoHeaders(String input) throws IOException
	{
		FileReader reader = new FileReader(input);

		BufferedReader bufReader = new BufferedReader(reader);
		MafHeaderUtil headerUtil = new MafHeaderUtil();

		String headerLine = headerUtil.extractHeader(bufReader);
		String parts[] = headerLine.split("\t");

		reader.close();

		return Arrays.asList(parts);
	}

	// Getters and Setters

	public AnnotatorConfig getConfig()
	{
		return config;
	}

	public void setConfig(AnnotatorConfig config)
	{
		this.config = config;
	}
}